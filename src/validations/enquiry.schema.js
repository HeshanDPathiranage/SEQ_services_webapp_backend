const { z } = require('zod');

const enquirySchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  phone: z.string().min(8, 'Phone is required.'),
  email: z.string().email('Enter a valid email address.'),
  location: z.string().min(2, 'Location is required.'),
  serviceRequired: z.string().min(2, 'Service required is required.'),
  serviceArea: z.string().optional(),
  message: z.string().min(5, 'Please provide more detail.'),
  recaptchaToken: z.string().optional(),
});

module.exports = { enquirySchema };
