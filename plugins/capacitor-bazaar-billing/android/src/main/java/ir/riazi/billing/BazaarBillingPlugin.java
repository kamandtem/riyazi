package ir.riazi.billing;

import androidx.activity.result.ActivityResultRegistry;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import ir.cafebazaar.poolakey.Connection;
import ir.cafebazaar.poolakey.ConnectionState;
import ir.cafebazaar.poolakey.Payment;
import ir.cafebazaar.poolakey.config.PaymentConfiguration;
import ir.cafebazaar.poolakey.config.SecurityCheck;
import ir.cafebazaar.poolakey.entity.PurchaseInfo;
import ir.cafebazaar.poolakey.entity.SkuDetails;
import ir.cafebazaar.poolakey.request.PurchaseRequest;
import kotlin.Unit;

/**
 * پلی بین برنامهٔ وب (Capacitor) و SDK رسمی پرداخت کافه‌بازار (Poolakey).
 *
 * کلید RSA از capacitor.config.ts (plugins.BazaarBilling.rsaPublicKey) خوانده می‌شود و
 * Poolakey با آن امضای هر خرید را روی گوشی راستی‌آزمایی می‌کند.
 *
 * متدها: isBazaarInstalled · getProduct · purchase · getPurchases
 * همهٔ کارهای Poolakey روی نخ اصلی انجام می‌شود (الزام SDK).
 */
@CapacitorPlugin(name = "BazaarBilling")
public class BazaarBillingPlugin extends Plugin {

    private static final String BAZAAR_PACKAGE = "com.farsitel.bazaar";

    private Payment payment;
    /** مرجع سراسری اتصال (طبق راهنمای Poolakey باید نگه داشته شود) */
    private Connection connection;
    private boolean connecting = false;
    private final List<Runnable> onConnected = new ArrayList<>();
    private final List<PluginCall> waitingCalls = new ArrayList<>();

    // ───────────────────────── ابزارها ─────────────────────────

    private void reject(PluginCall call, Throwable t) {
        String code = t == null ? "UNKNOWN" : t.getClass().getSimpleName();
        String msg = t == null || t.getMessage() == null ? code : t.getMessage();
        call.reject(msg, code);
    }

    private JSObject toJs(PurchaseInfo p) {
        JSObject o = new JSObject();
        o.put("orderId", p.getOrderId());
        o.put("purchaseToken", p.getPurchaseToken());
        o.put("payload", p.getPayload());
        o.put("packageName", p.getPackageName());
        o.put("purchaseState", p.getPurchaseState().name());
        o.put("purchaseTime", p.getPurchaseTime());
        o.put("productId", p.getProductId());
        o.put("dataSignature", p.getDataSignature());
        return o;
    }

    private boolean bazaarInstalled() {
        try {
            getContext().getPackageManager().getPackageInfo(BAZAAR_PACKAGE, 0);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /** وقتی به بازار وصل شدیم action را اجرا می‌کند؛ اگر اتصال شکست خورد، call رد می‌شود. (همیشه روی نخ اصلی) */
    private void whenConnected(PluginCall call, Runnable action) {
        String rsa = getConfig().getString("rsaPublicKey", "");
        if (rsa == null || rsa.trim().isEmpty()) {
            call.reject("rsaPublicKey در capacitor.config.ts تنظیم نشده است", "NO_RSA_KEY");
            return;
        }
        if (connection != null && connection.getState() instanceof ConnectionState.Connected) {
            action.run();
            return;
        }
        onConnected.add(action);
        waitingCalls.add(call);
        if (connecting) return;
        connecting = true;

        if (payment == null) {
            payment = new Payment(getContext(), new PaymentConfiguration(new SecurityCheck.Enable(rsa.trim()), false));
        }
        connection = payment.connect(cb -> {
            cb.connectionSucceed(() -> {
                connecting = false;
                List<Runnable> run = new ArrayList<>(onConnected);
                onConnected.clear();
                waitingCalls.clear();
                for (Runnable r : run) r.run();
                return Unit.INSTANCE;
            });
            cb.connectionFailed(t -> {
                connecting = false;
                List<PluginCall> calls = new ArrayList<>(waitingCalls);
                onConnected.clear();
                waitingCalls.clear();
                for (PluginCall c : calls) reject(c, t);
                return Unit.INSTANCE;
            });
            cb.disconnected(() -> {
                connecting = false;
                return Unit.INSTANCE;
            });
            return Unit.INSTANCE;
        });
    }

    private void onMain(Runnable r) {
        getActivity().runOnUiThread(r);
    }

    // ───────────────────────── متدهای قابل‌فراخوانی از JS ─────────────────────────

    @PluginMethod
    public void isBazaarInstalled(PluginCall call) {
        JSObject o = new JSObject();
        o.put("installed", bazaarInstalled());
        call.resolve(o);
    }

    /** قیمت و عنوان محصول (برای نمایش روی دکمهٔ پرداخت) */
    @PluginMethod
    public void getProduct(PluginCall call) {
        final String productId = call.getString("productId", "");
        onMain(() -> whenConnected(call, () ->
            payment.getInAppSkuDetails(Collections.singletonList(productId), cb -> {
                cb.getSkuDetailsSucceed(list -> {
                    JSObject o = new JSObject();
                    for (SkuDetails s : list) {
                        if (productId.equals(s.getSku())) {
                            o.put("productId", s.getSku());
                            o.put("price", s.getPrice());
                            o.put("title", s.getTitle());
                            o.put("description", s.getDescription());
                        }
                    }
                    call.resolve(o);
                    return Unit.INSTANCE;
                });
                cb.getSkuDetailsFailed(t -> { reject(call, t); return Unit.INSTANCE; });
                return Unit.INSTANCE;
            })));
    }

    /** باز کردن صفحهٔ پرداخت بازار برای خرید ماندگار (consume نمی‌شود) */
    @PluginMethod
    public void purchase(PluginCall call) {
        final String productId = call.getString("productId", "");
        final String payload = call.getString("payload", "");
        if (productId == null || productId.isEmpty()) { call.reject("productId لازم است", "NO_PRODUCT"); return; }
        if (!bazaarInstalled()) { call.reject("Bazaar is not installed", "BazaarNotFoundException"); return; }
        onMain(() -> whenConnected(call, () -> {
            ActivityResultRegistry registry = getActivity().getActivityResultRegistry();
            payment.purchaseProduct(registry, new PurchaseRequest(productId, payload, null), cb -> {
                cb.purchaseSucceed(info -> { call.resolve(toJs(info)); return Unit.INSTANCE; });
                cb.purchaseCanceled(() -> { call.reject("canceled", "CANCELED"); return Unit.INSTANCE; });
                cb.purchaseFailed(t -> { reject(call, t); return Unit.INSTANCE; });
                cb.failedToBeginFlow(t -> { reject(call, t); return Unit.INSTANCE; });
                cb.purchaseFlowBegan(() -> Unit.INSTANCE);
                return Unit.INSTANCE;
            });
        }));
    }

    /** خریدهای فعلی این کاربر (برای «بازیابی خرید» و بررسی هنگام شروع برنامه) */
    @PluginMethod
    public void getPurchases(PluginCall call) {
        onMain(() -> whenConnected(call, () ->
            payment.getPurchasedProducts(cb -> {
                cb.querySucceed(list -> {
                    JSArray arr = new JSArray();
                    for (PurchaseInfo p : list) arr.put(toJs(p));
                    JSObject o = new JSObject();
                    o.put("purchases", arr);
                    call.resolve(o);
                    return Unit.INSTANCE;
                });
                cb.queryFailed(t -> { reject(call, t); return Unit.INSTANCE; });
                return Unit.INSTANCE;
            })));
    }

    @Override
    protected void handleOnDestroy() {
        try { if (connection != null) connection.disconnect(); } catch (Exception ignored) { }
        connection = null;
        payment = null;
        connecting = false;
        super.handleOnDestroy();
    }
}
