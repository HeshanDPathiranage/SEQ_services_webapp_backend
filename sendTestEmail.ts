import { sendEnquiryEmail } from './src/services/email.service';
import { config } from './src/config/env';

// Override the EMAIL_TO config just for this run
config.EMAIL_TO = 'IT24103939@my.sliit.lk';

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
