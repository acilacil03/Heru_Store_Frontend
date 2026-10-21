import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // AMBIL KOLOM 'role' JUGA DARI DATABASE MYSQL
    const [users] = await db.query(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = users[0];

    // RESPON DIJAMIN MEMBAWA DATA ROLE ('admin' atau 'customer')
    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'customer', // Default ke 'customer' jika kosong
      },
    });
  } catch (error) {
    console.error('Error saat login:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}