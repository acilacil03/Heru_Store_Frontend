import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'Pilih file gambar untuk diunggah' }, { status: 400 });
    }

    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File yang diunggah harus berupa gambar (JPG, PNG, WEBP, GIF)' },
        { status: 400 }
      );
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: 'Ukuran file gambar terlalu besar. Maksimal 10 MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Coba upload ke Cloudinary jika akun sudah terkonfigurasi dengan benar
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    const hasValidCloudinary =
      (cloudName && apiKey && apiSecret && apiSecret !== apiKey) ||
      (cloudinaryUrl && !cloudinaryUrl.includes('api_key:api_secret'));

    if (hasValidCloudinary) {
      try {
        const { default: cloudinary, configureCloudinary } = await import('@/lib/cloudinary');
        configureCloudinary();

        const base64Data = buffer.toString('base64');
        const dataUri = `data:${file.type || 'image/jpeg'};base64,${base64Data}`;

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'cloth_studio/products',
          resource_type: 'image',
        });

        return NextResponse.json({
          message: 'Gambar berhasil diupload ke Cloudinary',
          url: result.secure_url,
          source: 'cloudinary',
        });
      } catch (cloudErr) {
        console.warn('Upload Cloudinary gagal, otomatis menggunakan penyimpanan lokal:', cloudErr.message);
      }
    }

    // 2. Simpan langsung secara lokal ke folder public/uploads (Langsung berhasil tanpa perlu konfigurasi!)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const originalExt = path.extname(file.name || '') || '.jpg';
    const uniqueFilename = `product-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${originalExt}`;
    const targetFilePath = path.join(uploadDir, uniqueFilename);

    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      message: 'Gambar berhasil diunggah',
      url: publicUrl,
      source: 'local',
    });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json(
      { message: err.message || 'Gagal mengupload gambar' },
      { status: 500 }
    );
  }
}
