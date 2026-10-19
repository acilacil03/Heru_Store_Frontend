import { query } from '../lib/db.js';

async function seed() {
  try {
    console.log('Membuat tabel users & products...');
    
    // Tabel Users
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabel Products (Katalog Baju)
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'Kaos',
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        stock INT NOT NULL DEFAULT 0,
        size VARCHAR(10) DEFAULT 'M',
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure all required columns exist even if table pre-existed
    const columns = await query(`SHOW COLUMNS FROM products`);
    const colNames = columns.map(c => c.Field);
    console.log('Kolom tabel products saat ini:', colNames);

    if (!colNames.includes('category')) {
      await query(`ALTER TABLE products ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'Kaos'`);
    }
    if (!colNames.includes('stock')) {
      await query(`ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0`);
    }
    if (!colNames.includes('size')) {
      await query(`ALTER TABLE products ADD COLUMN size VARCHAR(10) DEFAULT 'M'`);
    }
    if (!colNames.includes('description')) {
      await query(`ALTER TABLE products ADD COLUMN description TEXT`);
    }
    if (!colNames.includes('image_url')) {
      await query(`ALTER TABLE products ADD COLUMN image_url TEXT`);
    }

    // Cek apakah data sudah ada
    const [countResult] = await query(`SELECT COUNT(*) as total FROM products`);
    if (countResult && countResult.total > 0) {
      console.log(`Tabel products sudah memiliki ${countResult.total} data. Melewati insert dummy.`);
    } else {
      // Data Dummy Baju
      await query(`
        INSERT INTO products (name, category, price, stock, size, description, image_url) VALUES
        ('Kaos Oversize Streetwear', 'Kaos', 129000, 25, 'L', 'Bahan Cotton Combed 24s adem dan tebal.', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'),
        ('Kemeja Flannel Tartan Red', 'Kemeja', 189000, 15, 'M', 'Kemeja wol katun lembut cocok untuk style kasual.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'),
        ('Jaket Denim Washed Blue', 'Jaket', 299000, 10, 'XL', 'Jaket jeans klasik bahan kaku tahan lama.', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'),
        ('Hoodie Fleece Black', 'Sweater', 219000, 20, 'L', 'Hoodie fleece tebal dan hangat.', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500'),
        ('Celana Chino Slim Fit', 'Celana', 175000, 18, '32', 'Celana chino stretch sangat elastis.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500')
      `);
      console.log('Data dummy produk berhasil dimasukkan.');
    }

    // Seed User Akun Default
    const defaultUserEmail = 'rakaraka48246@gmail.com';
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [defaultUserEmail]);
    if (!existingUser || existingUser.length === 0) {
      await query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        ['Raka', defaultUserEmail, '123']
      );
      console.log(`User default ${defaultUserEmail} berhasil ditambahkan.`);
    }

    console.log('Seeding Berhasil!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Gagal:', err);
    process.exit(1);
  }
}

seed();