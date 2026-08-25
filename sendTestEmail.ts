import { sendEnquiryEmail } from './src/services/email.service';
import { config } from './src/config/env';

// Use EMAIL_TO from environment or fallback
const targetEmail = process.env.EMAIL_TO || config.EMAIL_TO || 'admin@seqservices.com.au';
config.EMAIL_TO = targetEmail;

const payload = {
  name: "Jane Smith (New Test)",
  email: "jane.test@example.com",
  phone: "0498765432",
  location: "Gold Coast",
  serviceCategory: "Residential Cleaning Services",
  serviceRequired: "End of Lease Cleaning",
  message: "This is a new test message to verify the updated dark/light mode styles!"
};

console.log('Sending test email to:', config.EMAIL_TO);

sendEnquiryEmail(payload)
  .then(() => {
    console.log("Email sent successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to send email:", err);
    process.exit(1);
  });
