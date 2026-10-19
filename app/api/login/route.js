import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const users = await query(
      'SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: 'Email tidak ditemukan' },
        { status: 401 }
      );
    }

    const user = users[0];
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Password salah' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Login berhasil!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login API Error:', err);
    return NextResponse.json(
      { message: err.message || 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
