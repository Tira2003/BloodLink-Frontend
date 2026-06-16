import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { icon: 16, text: 'text-lg', box: 'w-8 h-8' },
    md: { icon: 18, text: 'text-xl', box: 'w-9 h-9' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <Link to="/" className="flex items-center gap-2.5 font-heading font-extrabold text-text no-underline">
      <div className={`${s.box} rounded-lg bg-gradient-to-br from-red to-red-dark flex items-center justify-center shadow-md shrink-0`}>
        <Heart size={s.icon} fill="white" color="white" />
      </div>
      <span className={s.text}>
        <span className="text-gradient">Blood</span>Link
      </span>
    </Link>
  );
}
