import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ open, onClose, children, className = '' }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={`bg-surface border border-border-subtle rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideUp ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, subtitle, badge, onClose }) {
  return (
    <div className="flex items-center justify-between px-7 py-5 border-b border-border-subtle">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-lg font-bold font-heading">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
      </div>
      {onClose && (
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X size={18} />
        </Button>
      )}
    </div>
  );
}

export function ModalBody({ children, className = '' }) {
  return <div className={`px-7 py-6 ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex justify-end gap-3 px-7 py-5 border-t border-border-subtle ${className}`}>
      {children}
    </div>
  );
}
