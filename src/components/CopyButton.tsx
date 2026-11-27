import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label: string;
  copiedLabel?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  onCopied?: () => void;
  className?: string;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({
  text,
  label,
  copiedLabel = 'Copied',
  variant = 'secondary',
  onCopied,
  className = '',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      onCopied?.();
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700';

  const variantStyles = {
    primary: copied
      ? 'bg-emerald-700 text-white px-4 py-2'
      : 'bg-slate-900 text-white hover:bg-blue-700 px-4 py-2',
    secondary: copied
      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2'
      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 px-3 py-2',
    ghost: copied
      ? 'text-emerald-700 px-2.5 py-1.5'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5',
  }[variant];

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
      ) : (
        <Copy className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
      )}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
