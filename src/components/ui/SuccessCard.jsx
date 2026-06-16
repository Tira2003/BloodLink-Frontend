import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button, { ButtonLink } from './Button';

export default function SuccessCard({
  title,
  description,
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-8">
      <div className="bg-surface border border-border-subtle rounded-3xl shadow-lg max-w-md w-full p-10 text-center animate-slideUp">
        <div className="w-16 h-16 mx-auto mb-6 bg-green-light rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} className="text-cta" />
        </div>
        <h2 className="text-2xl font-extrabold font-heading mb-3">{title}</h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-8">{description}</p>
        <div className="flex flex-col gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>
    </div>
  );
}

export function SuccessLink({ to, children, variant = 'primary' }) {
  return (
    <Link to={to}>
      <Button variant={variant} size="lg" className="w-full justify-center">
        {children}
      </Button>
    </Link>
  );
}
