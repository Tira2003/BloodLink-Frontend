export const DEMO_USERS = {
  'donor@demo.com': {
    password: 'Demo@1234',
    user: {
      id: 1,
      name: 'Ahmed Rashid',
      fullName: 'Ahmed Rashid',
      email: 'donor@demo.com',
      role: 'DONOR',
      bloodType: 'O+',
      phone: '+94 77 123 4567',
      age: 28,
      district: 'Colombo',
      nearestHospital: 'National Hospital Colombo',
      totalDonations: 5,
      rewardPoints: 50,
    },
  },
  'hospital@demo.com': {
    password: 'Demo@1234',
    user: {
      id: 2,
      name: 'Dr. Kamal Perera',
      fullName: 'Dr. Kamal Perera',
      email: 'hospital@demo.com',
      role: 'HOSPITAL',
      phone: '+94 11 269 1111',
      district: 'Colombo',
      hospitalName: 'National Hospital Colombo',
    },
  },
};

export function tryDemoLogin(email, password) {
  const account = DEMO_USERS[email.toLowerCase().trim()];
  if (!account || account.password !== password) return null;

  return {
    token: `demo-token-${account.user.id}`,
    user: account.user,
  };
}
