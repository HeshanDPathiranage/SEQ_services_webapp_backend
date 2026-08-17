import { Router } from 'express';
import { handleEnquiry } from '../controllers/enquiry.controller';
import { validateRequest } from '../middleware/validateRequest';
import { enquirySchema } from '../validations/enquiry.schema';

const router = Router();

router.post('/', validateRequest(enquirySchema), handleEnquiry);

export default router;
