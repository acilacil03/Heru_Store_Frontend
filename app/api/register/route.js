import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Semua data (nama, email, password) harus diisi' },
        { status: 400 }
      );
    }

    // Periksa apakah email sudah terdaftar
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' },
        { status: 409 }
      );
    }

    // Simpan user baru
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    return NextResponse.json(
      {
        message: 'Registrasi berhasil!',
        user: { id: result.insertId, name, email },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Register API Error:', err);
    return NextResponse.json(
      { message: err.message || 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
