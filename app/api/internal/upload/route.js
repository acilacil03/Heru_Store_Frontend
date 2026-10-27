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

    // Simpan lokal ke folder public/uploads
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
