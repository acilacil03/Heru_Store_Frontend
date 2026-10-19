import { query } from '../lib/db.js';

async function addUser() {
  try {
    console.log('Menyiapkan tabel users dan menambahkan akun...');
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const email = 'rakaraka48246@gmail.com';
    const password = '123';
    const name = 'Raka';

    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      await query('UPDATE users SET password = ?, name = ? WHERE email = ?', [password, name, email]);
      console.log(`Akun ${email} berhasil diperbarui dengan password ${password}.`);
    } else {
      await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
      console.log(`Akun ${email} berhasil dibuat dengan password ${password}.`);
    }

    await query('UPDATE users SET name = ?, email = ? WHERE id = 2', ['Admin Store', 'admin@clothstore.com']);

    const allUsers = await query('SELECT id, name, email FROM users');
    console.log('Daftar users saat ini:', allUsers);

    process.exit(0);
  } catch (err) {
    console.error('Gagal menambahkan akun:', err);
    process.exit(1);
  }
}

addUser();
