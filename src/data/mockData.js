export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_COMPATIBILITY = {
  'A+':  ['A+', 'AB+'],
  'A-':  ['A+', 'A-', 'AB+', 'AB-'],
  'B+':  ['B+', 'AB+'],
  'B-':  ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+':  ['A+', 'B+', 'O+', 'AB+'],
  'O-':  ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
};

export const mockDonors = [
  { id: 1, name: 'Ahmed Rashid', bloodType: 'O+', city: 'Colombo', available: true, lastDonated: '2025-03-10', totalDonations: 12, phone: '+94 77 123 4567', age: 28 },
  { id: 2, name: 'Priya Nair', bloodType: 'A-', city: 'Kandy', available: true, lastDonated: '2025-01-22', totalDonations: 7, phone: '+94 71 987 6543', age: 34 },
  { id: 3, name: 'Kasun Perera', bloodType: 'B+', city: 'Colombo', available: false, lastDonated: '2026-04-01', totalDonations: 5, phone: '+94 76 555 4321', age: 25 },
  { id: 4, name: 'Nimal Silva', bloodType: 'AB+', city: 'Galle', available: true, lastDonated: '2024-11-14', totalDonations: 20, phone: '+94 70 111 2222', age: 42 },
  { id: 5, name: 'Amara Fernando', bloodType: 'O-', city: 'Colombo', available: true, lastDonated: '2025-12-01', totalDonations: 15, phone: '+94 78 333 5555', age: 31 },
  { id: 6, name: 'Ravi Kumar', bloodType: 'B-', city: 'Matara', available: true, lastDonated: '2025-09-20', totalDonations: 3, phone: '+94 72 777 8888', age: 27 },
];

export const mockRequests = [
  { id: 1, patientName: 'Sanduni W.', bloodType: 'O+', units: 2, urgency: 'CRITICAL', status: 'PENDING', hospital: 'National Hospital Colombo', city: 'Colombo', createdAt: '2026-06-11T08:30:00', notes: 'Emergency surgery required', requester: 'Dr. Kamal' },
  { id: 2, patientName: 'Lakshan P.', bloodType: 'A+', units: 1, urgency: 'HIGH', status: 'MATCHED', hospital: 'Kandy Teaching Hospital', city: 'Kandy', createdAt: '2026-06-10T15:00:00', notes: 'Road accident victim', requester: 'Dr. Priya' },
  { id: 3, patientName: 'Malini R.', bloodType: 'B-', units: 3, urgency: 'MEDIUM', status: 'IN_PROGRESS', hospital: 'Galle General Hospital', city: 'Galle', createdAt: '2026-06-09T10:00:00', notes: 'Scheduled surgery', requester: 'Dr. Nimal' },
  { id: 4, patientName: 'Chatura S.', bloodType: 'AB+', units: 1, urgency: 'LOW', status: 'COMPLETED', hospital: 'Colombo South Hospital', city: 'Colombo', createdAt: '2026-06-08T09:00:00', notes: '', requester: 'Dr. Anura' },
  { id: 5, patientName: 'Iresha M.', bloodType: 'O-', units: 2, urgency: 'CRITICAL', status: 'PENDING', hospital: 'National Hospital Colombo', city: 'Colombo', createdAt: '2026-06-11T12:00:00', notes: 'Universal donor required', requester: 'Dr. Kamal' },
];

export const mockInventory = [
  { bloodType: 'A+', units: 25, lowThreshold: 10 },
  { bloodType: 'A-', units: 8, lowThreshold: 5 },
  { bloodType: 'B+', units: 15, lowThreshold: 10 },
  { bloodType: 'B-', units: 3, lowThreshold: 5 },
  { bloodType: 'AB+', units: 12, lowThreshold: 5 },
  { bloodType: 'AB-', units: 2, lowThreshold: 3 },
  { bloodType: 'O+', units: 30, lowThreshold: 15 },
  { bloodType: 'O-', units: 6, lowThreshold: 8 },
];

export const mockNotifications = [
  { id: 1, title: 'Donation Request Match!', message: 'A critical O+ request near Colombo needs your help.', type: 'REQUEST_MATCH', isRead: false, createdAt: '2026-06-11T08:35:00' },
  { id: 2, title: 'Request Status Updated', message: 'Your blood request for patient Lakshan P. is now MATCHED.', type: 'STATUS_UPDATE', isRead: false, createdAt: '2026-06-10T15:05:00' },
  { id: 3, title: 'Inventory Alert', message: 'B- blood units are critically low (3 units). Please replenish.', type: 'INVENTORY_ALERT', isRead: true, createdAt: '2026-06-09T09:00:00' },
  { id: 4, title: 'Donation Completed', message: 'Thank you! Your donation for request #4 has been recorded.', type: 'STATUS_UPDATE', isRead: true, createdAt: '2026-06-08T14:00:00' },
];

export const mockStats = {
  totalDonors: 1248,
  totalRequests: 342,
  completedDonations: 289,
  activeRequests: 53,
  hospitalsConnected: 28,
  livesSaved: 289,
};

export const mockChartData = {
  monthly: [
    { month: 'Jan', donations: 38, requests: 45 },
    { month: 'Feb', donations: 42, requests: 50 },
    { month: 'Mar', donations: 55, requests: 60 },
    { month: 'Apr', donations: 48, requests: 52 },
    { month: 'May', donations: 61, requests: 65 },
    { month: 'Jun', donations: 45, requests: 70 },
  ],
  bloodTypeDistribution: [
    { type: 'O+', count: 35 },
    { type: 'A+', count: 28 },
    { type: 'B+', count: 18 },
    { type: 'AB+', count: 8 },
    { type: 'O-', count: 5 },
    { type: 'A-', count: 3 },
    { type: 'B-', count: 2 },
    { type: 'AB-', count: 1 },
  ],
};
