import { Phone, Mail, MapPin } from 'lucide-react';

const CONTACT_ITEMS = [
  { icon: Phone, text: '+94 11 234 5678' },
  { icon: Mail, text: 'support@bloodlink.lk' },
  { icon: MapPin, text: 'Colombo, Sri Lanka' },
];

export default function FooterContact() {
  return (
    <div>
      <h4 className="text-white font-heading font-bold mb-4 text-sm uppercase tracking-widest">
        Contact
      </h4>
      <div className="flex flex-col gap-3 text-sm text-white/70">
        {CONTACT_ITEMS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <Icon size={14} className="text-secondary shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
