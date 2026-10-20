import { query } from '../lib/db.js';

async function updateUsers() {
  try {
    // Pastikan Bina terhapus
    await query("DELETE FROM mapil_project.users WHERE email LIKE '%bina%' OR name LIKE '%Bina%'");

    // Pastikan Heru ada
    const checkHeru = await query("SELECT id FROM mapil_project.users WHERE email = 'heru@gmail.com'");
    if (checkHeru.length === 0) {
      await query("INSERT INTO mapil_project.users (name, email, password) VALUES (?, ?, ?)", ['Heru', 'heru@gmail.com', '123']);
    }

    // Pastikan Raka ada (raka@gmail.com)
    const checkRaka1 = await query("SELECT id FROM mapil_project.users WHERE email = 'raka@gmail.com'");
    if (checkRaka1.length === 0) {
      await query("INSERT INTO mapil_project.users (name, email, password) VALUES (?, ?, ?)", ['Raka', 'raka@gmail.com', '123']);
    }

    // Pastikan Raka email rakaraka48246@gmail.com juga bisa login
    const checkRaka2 = await query("SELECT id FROM mapil_project.users WHERE email = 'rakaraka48246@gmail.com'");
    if (checkRaka2.length === 0) {
      await query("INSERT INTO mapil_project.users (name, email, password) VALUES (?, ?, ?)", ['Raka', 'rakaraka48246@gmail.com', '123']);
    }

    const finalUsers = await query("SELECT id, name, email, password, created_at FROM mapil_project.users ORDER BY id ASC");
    console.table(finalUsers);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateUsers();
