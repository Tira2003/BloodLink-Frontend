import { Droplets, Bell, Shield, Heart, Users, Tent } from 'lucide-react';

export const HOME_FEATURES = [
  {
    icon: Droplets,
    title: 'Smart Donor Matching',
    desc: 'Donors are matched automatically by blood type and location. No manual searching needed.',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    icon: Bell,
    title: 'SMS & Email Alerts',
    desc: 'Donors get notified instantly via SMS and email — no need to constantly check the site.',
    iconBg: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Shield,
    title: 'Verified & Secure',
    desc: 'All donors and hospitals are verified. Your personal information stays private.',
    iconBg: 'bg-cta/10 text-cta',
  },
  {
    icon: Heart,
    title: 'Reward Points',
    desc: 'Donors earn reward points for every accepted donation — building a culture of giving.',
    iconBg: 'bg-red-light text-red',
  },
  {
    icon: Users,
    title: 'Hospital Network',
    desc: 'Connected with hospitals and blood banks across Sri Lanka for faster coordination.',
    iconBg: 'bg-purple-500/10 text-purple-600',
  },
  {
    icon: Tent,
    title: 'Donation Camps',
    desc: 'Hospitals and blood banks can organize donation camps and share them with the community.',
    iconBg: 'bg-amber-light text-amber',
  },
];

export const HOME_STEPS = [
  {
    title: 'Register as a Donor',
    desc: 'Fill in your name, age, blood type, district, and nearest hospital. Takes under 2 minutes.',
    tag: 'For Donors',
    tagClass: 'bg-primary/10 text-primary',
  },
  {
    title: 'Request is Posted',
    desc: 'A patient or hospital posts a blood request with urgency level, blood type, and location.',
    tag: 'For Patients',
    tagClass: 'bg-cta/10 text-cta',
  },
  {
    title: 'You Get Notified',
    desc: 'Matched donors receive an SMS and email. They check the requests page and accept or pass.',
    tag: 'Automated',
    tagClass: 'bg-amber-light text-amber',
  },
  {
    title: 'Donate & Earn Points',
    desc: 'Accepted donors show up, donate, and earn reward points on the platform.',
    tag: 'Impact',
    tagClass: 'bg-red-light text-red',
  },
];

export const HOME_VOICES = [
  {
    name: 'Anjali P.',
    role: 'Donor · Galle',
    text: 'I forgot I had even signed up — until the notification arrived. Twenty minutes later I was at the hospital. It felt small. It wasn\'t.',
  },
  {
    name: 'Dr. Mendis',
    role: 'Transfusion Lead, Grace General',
    text: 'We used to spend hours calling our donor list. BloodLink reaches the right people in seconds. It has genuinely changed how we work.',
  },
  {
    name: 'Kavindi R.',
    role: 'Family member',
    text: 'When my father needed blood, three strangers showed up before sunrise. I don\'t know how to thank a community like that.',
  },
];

export const HOME_IMPACT_STORIES = [
  {
    category: 'Emergency',
    time: '2 hours',
    title: 'A new mother in Colombo',
    body: 'Postpartum haemorrhage required 4 units of O-. Six donors arrived within ninety minutes. She\'s home with her daughter today.',
  },
  {
    category: 'Chronic care',
    time: 'Ongoing',
    title: 'Ravindu\'s monthly transfusions',
    body: 'Living with Thalassemia, Ravindu now has a quiet roster of nine regular donors who keep his calendar full.',
  },
  {
    category: 'Trauma',
    time: '48 minutes',
    title: 'Highway accident, Kandy',
    body: 'A coordinated response sent three B+ donors straight to the trauma ward. The patient walked out the following week.',
  },
];

export const HOME_FAQS = [
  {
    question: 'Who can become a donor?',
    answer:
      'Anyone aged 18–60, weighing over 50kg, and in general good health. A short screening confirms eligibility before each donation.',
  },
  {
    question: 'How often will I be notified?',
    answer:
      'Only when your blood type is actively needed within your district. Most donors receive 1–3 alerts per month — never marketing.',
  },
  {
    question: 'Is my personal information shared?',
    answer:
      'No. Patients never see your details. The requesting hospital is the only party that can coordinate your visit with you.',
  },
  {
    question: 'What do reward points unlock?',
    answer:
      'Points convert to wellness perks — free health check-ups, partner-pharmacy discounts, and recognition in our annual community report.',
  },
  {
    question: 'Can hospitals join the network?',
    answer:
      'Yes. Licensed hospitals and blood banks can request onboarding from the About page; verification typically completes within a week.',
  },
];
