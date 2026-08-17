const { Router } = require('express');
const { handleEnquiry } = require('../controllers/enquiry.controller');
const { validateRequest } = require('../middleware/validateRequest');
const { enquirySchema } = require('../validations/enquiry.schema');

const router = Router();

router.post('/', validateRequest(enquirySchema), handleEnquiry);

module.exports = router;
