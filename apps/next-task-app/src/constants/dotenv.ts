const dotenv = {
  TRANSLATION_API_URL: process.env.NEXT_PUBLIC_TRANSLATION_API_URL || 'http://localhost:3005',
  TRANSLATION_API_KEY: process.env.NEXT_PUBLIC_TRANSLATION_API_KEY || '',
};

export default dotenv;
