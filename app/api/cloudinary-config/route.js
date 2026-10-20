import { NextResponse } from 'next/server';
import cloudinary, { configureCloudinary } from '@/lib/cloudinary';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const hasCloud = Boolean(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL);
  const hasKey = Boolean(process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_URL);
  const hasSecret = Boolean(process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_URL);

  const configured = Boolean((hasCloud && hasKey && hasSecret) || process.env.CLOUDINARY_URL);

  return NextResponse.json({
    configured,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { cloud_name, api_key, api_secret, cloudinary_url } = body;

    let targetCloud = cloud_name?.trim() || '';
    let targetKey = api_key?.trim() || '';
    let targetSecret = api_secret?.trim() || '';
    let targetUrl = cloudinary_url?.trim() || '';

    // Bersihkan format CLOUDINARY_URL jika di-paste lengkap
    if (targetUrl) {
      if (targetUrl.startsWith('CLOUDINARY_URL=')) {
        targetUrl = targetUrl.replace('CLOUDINARY_URL=', '').trim();
      }
      targetUrl = targetUrl.replace(/^["']|["']$/g, '').trim();

      const urlMatch = targetUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
      if (urlMatch) {
        targetKey = urlMatch[1];
        targetSecret = urlMatch[2];
        targetCloud = urlMatch[3];
      }
    }

    if (!targetCloud || !targetKey || !targetSecret) {
      return NextResponse.json(
        { message: 'Cloud Name, API Key, dan API Secret wajib diisi semua.' },
        { status: 400 }
      );
    }

    // Peringatan jika pengguna tidak sengaja mengisi API Secret dengan API Key yang sama
    if (targetSecret === targetKey) {
      return NextResponse.json(
        {
          message:
            'Nilai API Secret tidak boleh sama dengan API Key. Di dashboard Cloudinary, klik ikon mata atau tombol salin pada baris "API Secret" untuk mendapatkan rahasia akun Anda.',
        },
        { status: 400 }
      );
    }

    process.env.CLOUDINARY_CLOUD_NAME = targetCloud;
    process.env.CLOUDINARY_API_KEY = targetKey;
    process.env.CLOUDINARY_API_SECRET = targetSecret;
    delete process.env.CLOUDINARY_URL;

    // Re-configure instance
    configureCloudinary();

    // Verifikasi kredensial ke server Cloudinary
    try {
      await cloudinary.api.ping();
    } catch (testErr) {
      console.error('Cloudinary Ping Failed:', testErr);
      let detail = testErr.message || testErr.error?.message || 'Pastikan kredensial benar.';
      if (detail.includes('mismatch') || detail.includes('signature') || testErr.http_code === 401 || testErr.error?.http_code === 401) {
        detail = 'API Secret tidak cocok dengan API Key. Di dashboard Cloudinary, klik ikon mata atau tombol salin di samping "API Secret" (nilainya berbeda dengan API Key).';
      }
      return NextResponse.json(
        {
          message: `Kredensial Cloudinary ditolak: ${detail}`,
        },
        { status: 400 }
      );
    }

    // Simpan ke file .env.local
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      // Hapus baris lama jika ada
      envContent = envContent
        .replace(/^CLOUDINARY_CLOUD_NAME=.*$/gm, '')
        .replace(/^CLOUDINARY_API_KEY=.*$/gm, '')
        .replace(/^CLOUDINARY_API_SECRET=.*$/gm, '')
        .replace(/^CLOUDINARY_URL=.*$/gm, '')
        .trimEnd();

      if (targetUrl) {
        envContent += `\nCLOUDINARY_URL=${targetUrl}\n`;
      } else {
        envContent += `\nCLOUDINARY_CLOUD_NAME=${targetCloud}\nCLOUDINARY_API_KEY=${targetKey}\nCLOUDINARY_API_SECRET=${targetSecret}\n`;
      }

      fs.writeFileSync(envPath, envContent, 'utf8');
    } catch (fsErr) {
      console.warn('Gagal menulis .env.local:', fsErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Cloudinary berhasil diverifikasi dan terhubung!',
      cloud_name: targetCloud || 'Aktif via CLOUDINARY_URL',
    });
  } catch (err) {
    console.error('Cloudinary Config Error:', err);
    return NextResponse.json(
      { message: err.message || 'Terjadi kesalahan saat memverifikasi Cloudinary' },
      { status: 500 }
    );
  }
}
