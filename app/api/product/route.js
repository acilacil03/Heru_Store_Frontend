import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. READ ALL / SEARCH
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    let sql = 'SELECT * FROM products';
    let params = [];

    if (search) {
      sql += ' WHERE name LIKE ? OR category LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    sql += ' ORDER BY id DESC';

    const products = await query(sql, params);
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// 2. CREATE
export async function POST(req) {
  try {
    const { name, category, price, stock, size, description, image_url } = await req.json();

    const result = await query(
      'INSERT INTO products (name, category, price, stock, size, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, price, stock, size, description, image_url]
    );

    return NextResponse.json({ message: 'Produk berhasil ditambahkan', id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// 3. UPDATE
export async function PUT(req) {
  try {
    const { id, name, category, price, stock, size, description, image_url } = await req.json();

    await query(
      'UPDATE products SET name=?, category=?, price=?, stock=?, size=?, description=?, image_url=? WHERE id=?',
      [name, category, price, stock, size, description, image_url, id]
    );

    return NextResponse.json({ message: 'Produk berhasil diubah' });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// 4. DELETE
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ message: 'ID produk dibutuhkan' }, { status: 400 });

    await query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}