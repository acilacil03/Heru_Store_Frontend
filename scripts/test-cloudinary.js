import { configureCloudinary } from '../lib/cloudinary.js';

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary connection...');
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');
    console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'SET' : 'NOT SET');

    const cloudinary = configureCloudinary();

    // Test ping to Cloudinary API
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary Connection SUCCESSFUL!');
    console.log('Ping result:', result);
    process.exit(0);
  } catch (err) {
    console.error('❌ Cloudinary Connection FAILED!');
    console.error('Error:', err.message);
    console.error('Full error:', err);
    console.error('\n💡 TIPS:');
    console.error('1. Pastikan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET sudah diisi di .env.local');
    console.error('2. Cek dashboard Cloudinary untuk mendapatkan nilai yang benar');
    console.error('3. API Secret berbeda dengan API Key (klik ikon mata di dashboard untuk melihat)');
    process.exit(1);
  }
}

testCloudinary();
