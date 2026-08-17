const app = require('./dist/app.js').default || require('./dist/app.js');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`SEQ Services backend running on port ${PORT}`);
});
