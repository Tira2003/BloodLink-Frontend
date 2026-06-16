import { useEffect, useMemo, useRef, useState } from 'react';
import { Children, isValidElement } from 'react';
import { ChevronDown } from 'lucide-react';

export function FormGroup({ children, className = '' }) {
  return <div className={`flex flex-col gap-1.5 ${className}`}>{children}</div>;
}

export function FormLabel({ htmlFor, children, className = '' }) {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-semibold text-text ${className}`}>
      {children}
    </label>
  );
}

export function FormInput({ icon: Icon, iconClassName = 'text-text-muted', className = '', ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${iconClassName}`}
        />
      )}
      <input
        className={`w-full py-2.5 px-4 bg-bg border-2 border-border rounded-lg text-sm text-text outline-none transition-all duration-200 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:opacity-55 ${Icon ? 'pl-10' : ''} ${className}`}
        {...props}
      />
    </div>
  );
}

export function FormSelect({
  icon: Icon,
  iconClassName = 'text-text-muted',
  className = '',
  children,
  value,
  onChange,
  disabled,
  id,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const options = useMemo(() => {
    return Children.toArray(children)
      .filter((child) => isValidElement(child) && child.type === 'option')
      .map((option) => ({
        value: option.props.value ?? '',
        label: option.props.children,
      }));
  }, [children]);

  const selected = options.find((opt) => String(opt.value) === String(value));
  const triggerLabel = selected?.label || options[0]?.label || 'Select';

  useEffect(() => {
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSelect = (nextValue) => {
    setOpen(false);
    onChange?.({ target: { value: nextValue, id, name: props.name } });
  };

  return (
    <div className="relative" ref={rootRef}>
      {Icon && (
        <Icon
          size={15}
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${iconClassName}`}
        />
      )}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`w-full py-2.5 px-4 bg-bg border-2 border-border rounded-lg text-sm text-text outline-none transition-all duration-200 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 disabled:opacity-55 disabled:cursor-not-allowed text-left cursor-pointer ${Icon ? 'pl-10' : ''} ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? 'text-text' : 'text-text-muted'}>{triggerLabel}</span>
        <ChevronDown
          size={14}
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          className="absolute z-[2100] mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border-subtle bg-surface py-1 shadow-md"
        >
          {options.map((option) => (
            <li key={`${id}-${option.value}`}>
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-primary-light/40 ${
                  String(option.value) === String(value)
                    ? 'bg-primary-light/50 text-primary-dark font-semibold'
                    : 'text-text'
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FormTextarea({ className = '', ...props }) {
  return (
    <textarea
      className={`w-full py-2.5 px-4 bg-bg border-2 border-border rounded-lg text-sm text-text outline-none transition-all duration-200 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 resize-y min-h-20 ${className}`}
      {...props}
    />
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return (
    <span className="text-xs text-red" role="alert">
      {children}
    </span>
  );
}

export function FormHint({ children }) {
  if (!children) return null;
  return <span className="text-xs text-text-muted">{children}</span>;
}
