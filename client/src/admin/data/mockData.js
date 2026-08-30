export const enquiryStatusLabels = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  IN_PROGRESS: 'In Progress',
  CONVERTED: 'Converted',
  CLOSED: 'Closed',
  RESOLVED: 'Closed',
};

export const enquiryStatusOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CONVERTED', label: 'Converted' },
  { value: 'CLOSED', label: 'Closed' },
];

export const getEnquiryStatusLabel = (status) =>
  enquiryStatusLabels[status] || status;

export const normalizeEnquiryStatus = (status) =>
  status === 'RESOLVED' ? 'CLOSED' : status;

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

export const formatDateTime = (dateString) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(dateString));
