#!/usr/bin/env python3
"""
بعد از «npx cap add android» اجرا شود (workflow این کار را می‌کند).
مخزن jitpack را اضافه می‌کند تا کتابخانهٔ پرداخت کافه‌بازار (Poolakey) دانلود شود. چندبار اجرا هم مشکلی ندارد.
"""
import re, pathlib, sys

JITPACK = "maven { url 'https://jitpack.io' }"
root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "android")

def patch(path, fn):
    f = root / path
    if not f.exists():
        return False
    s = f.read_text(encoding="utf-8")
    if "jitpack.io" in s:
        print(f"{path}: jitpack از قبل هست")
        return True
    new = fn(s)
    if new == s:
        return False
    f.write_text(new, encoding="utf-8")
    print(f"{path}: jitpack اضافه شد")
    return True

# روش قدیمی: allprojects { repositories { ... } }
def in_build(s):
    return re.sub(r"(allprojects\s*\{\s*repositories\s*\{)", r"\1\n        " + JITPACK, s, count=1)
# روش جدید: dependencyResolutionManagement { repositories { ... } }
def in_settings(s):
    return re.sub(r"(dependencyResolutionManagement\s*\{\s*(?:repositoriesMode[^\n]*\n\s*)?repositories\s*\{)", r"\1\n        " + JITPACK, s, count=1)

ok = patch("build.gradle", in_build)
ok = patch("settings.gradle", in_settings) or ok
if not ok:
    print("هشدار: جای مناسب برای jitpack پیدا نشد؛ مخزن در خود پلاگین (plugins/capacitor-bazaar-billing) هم تعریف شده است.")
