import catchAsync from '../utils/catchAsync.js';
import {
  createContactEnquiry,
  deleteEnquiry,
  getAdminEnquiries,
  updateEnquiryStatus,
} from '../services/enquiryService.js';

export const getAdminEnquiriesHandler = catchAsync(async (req, res) => {
  const { enquiries, stats } = await getAdminEnquiries({
    limit: req.query.limit,
  });

  res.status(200).json({
    success: true,
    data: { enquiries, stats },
  });
});

export const createContactEnquiryHandler = catchAsync(async (req, res) => {
  const enquiry = await createContactEnquiry(req.body);

  res.status(201).json({
    success: true,
    message: 'Enquiry submitted successfully',
    data: { id: enquiry.id },
  });
});

export const updateEnquiryStatusHandler = catchAsync(async (req, res) => {
  const enquiry = await updateEnquiryStatus(req.params.id, req.body.status);

  res.status(200).json({
    success: true,
    message: 'Enquiry status updated',
    data: { enquiry },
  });
});

export const deleteEnquiryHandler = catchAsync(async (req, res) => {
  await deleteEnquiry(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Enquiry deleted successfully',
  });
});
