import React from 'react';
/** نمایش ایموجی داخل حباب بازخورد */
export const WordPic: React.FC<{ value?: string; className?: string }> = ({ value, className = '' }) => <span className={className} aria-hidden="true">{value || '⭐'}</span>;
