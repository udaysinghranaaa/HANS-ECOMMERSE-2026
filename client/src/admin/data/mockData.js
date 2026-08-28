export const dashboardStats = {
  totalProducts: 48,
  totalCategories: 8,
  newEnquiries: 12,
  pendingEnquiries: 5,
};

export const mockCategories = [
  {
    id: '1',
    name: 'Solar Panels',
    description: 'High-efficiency monocrystalline and polycrystalline panels',
    productCount: 18,
    isActive: true,
  },
  {
    id: '2',
    name: 'Inverters',
    description: 'String and hybrid inverters for residential and commercial use',
    productCount: 12,
    isActive: true,
  },
  {
    id: '3',
    name: 'Batteries',
    description: 'Lithium-ion storage solutions for backup and off-grid systems',
    productCount: 9,
    isActive: true,
  },
  {
    id: '4',
    name: 'Mounting Structures',
    description: 'Rooftop and ground-mount racking systems',
    productCount: 6,
    isActive: false,
  },
];

export const mockProducts = [
  {
    id: '1',
    name: 'HANS Power 400W Mono Panel',
    category: 'Solar Panels',
    price: 18500,
    stock: 120,
    isActive: true,
  },
  {
    id: '2',
    name: 'HANS Hybrid 5kW Inverter',
    category: 'Inverters',
    price: 62000,
    stock: 34,
    isActive: true,
  },
  {
    id: '3',
    name: 'HANS Lithium 5kWh Battery',
    category: 'Batteries',
    price: 89000,
    stock: 22,
    isActive: true,
  },
  {
    id: '4',
    name: 'Rooftop Mount Kit – 10 Panel',
    category: 'Mounting Structures',
    price: 14500,
    stock: 0,
    isActive: false,
  },
  {
    id: '5',
    name: 'HANS Power 550W Bifacial Panel',
    category: 'Solar Panels',
    price: 24900,
    stock: 86,
    isActive: true,
  },
];

export const mockEnquiries = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    subject: '5kW rooftop solar quote',
    message: 'Looking for installation at my home in Pune. Please share estimate.',
    status: 'NEW',
    createdAt: '2026-08-28T09:15:00',
  },
  {
    id: '2',
    name: 'Priya Mehta',
    email: 'priya.mehta@example.com',
    phone: '+91 91234 56789',
    subject: 'Commercial solar inquiry',
    message: 'Need solar setup for a 3000 sq ft warehouse in Ahmedabad.',
    status: 'CONTACTED',
    createdAt: '2026-08-27T14:30:00',
  },
  {
    id: '3',
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    phone: '+91 99887 76655',
    subject: 'Battery backup options',
    message: 'Which battery works best with your 3kW hybrid inverter?',
    status: 'IN_PROGRESS',
    createdAt: '2026-08-26T11:00:00',
  },
  {
    id: '4',
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@example.com',
    phone: '+91 90909 80808',
    subject: 'Maintenance contract',
    message: 'Annual AMC pricing for a 10kW system installed last year.',
    status: 'RESOLVED',
    createdAt: '2026-08-20T16:45:00',
  },
];

export const enquiryStatusLabels = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (dateString) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
