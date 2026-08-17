const dns = require('dns');
const app = require('./app');
const dotenv = require('dotenv');

// Force Node.js to resolve IPv4 addresses first to prevent ENETUNREACH errors on cloud hosting (Render/AWS)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`SEQ Services backend running on port ${PORT}`);
});
