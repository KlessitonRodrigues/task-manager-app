require('dotenv').config({ quiet: true });

const dotenv = {
  STACK_NAME: process.env.STACK_NAME || '',
  TEST_API_URL: process.env.TEST_API_URL || '',
  AWS_REGION: process.env.AWS_REGION || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
};

export default dotenv;
