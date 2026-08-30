import * as XLSX from 'xlsx';
import { getEnquiryStatusLabel, formatDateTime } from '@/admin/data/mockData';

export const exportEnquiriesToExcel = (enquiries) => {
  const rows = enquiries.map((enquiry) => ({
    Name: enquiry.name,
    Phone: enquiry.phone,
    Email: enquiry.email,
    Subject: enquiry.subject,
    Requirement: enquiry.message,
    Status: getEnquiryStatusLabel(enquiry.status),
    'Date/Time': formatDateTime(enquiry.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Enquiries');

  const columnWidths = [
    { wch: 24 },
    { wch: 16 },
    { wch: 28 },
    { wch: 32 },
    { wch: 48 },
    { wch: 14 },
    { wch: 22 },
  ];
  worksheet['!cols'] = columnWidths;

  const dateStamp = new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .replace(/\//g, '-');

  XLSX.writeFile(workbook, `hans-solar-enquiries-${dateStamp}.xlsx`);
};
