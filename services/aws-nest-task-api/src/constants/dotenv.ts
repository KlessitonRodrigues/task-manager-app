require('dotenv').config({ quiet: true });

const dotenv = {
  BASE_URL: process.env.BASE_URL || '',
  TASK_TABLE_NAME: process.env.TASK_TABLE_NAME || '',
  AWS_REGION: process.env.AWS_REGION || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
};

export default dotenv;
