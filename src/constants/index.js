export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const SL_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
];

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/requests', label: 'Requests' },
  { to: '/camps', label: 'Donation Camp' },
  { to: '/about', label: 'About' },
];

export const URGENCY_OPTIONS = [
  {
    value: 'CRITICAL',
    label: 'Critical',
    desc: 'Immediate need — life-threatening situation',
    color: 'text-red',
    bg: 'bg-red-light',
    border: 'border-red',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    desc: 'Needed within 24–48 hours',
    color: 'text-amber',
    bg: 'bg-amber-light',
    border: 'border-amber',
  },
  {
    value: 'LOW',
    label: 'Low',
    desc: 'Scheduled surgery or non-urgent need',
    color: 'text-cta',
    bg: 'bg-green-light',
    border: 'border-cta',
  },
];

export const STATUS_CONFIG = {
  PENDING: { label: 'Open', variant: 'pending' },
  MATCHED: { label: 'Matched', variant: 'matched' },
  IN_PROGRESS: { label: 'In Progress', variant: 'matched' },
  COMPLETED: { label: 'Completed', variant: 'completed' },
};
