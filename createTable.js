const pool = require('./db');

pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL');
    pool.query(`ALTER TABLE expenses
ADD COLUMN user_id INTEGER REFERENCES users(id);`);
return pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
  `);
    return pool.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        amount NUMERIC(10,2),
        category VARCHAR(100),
        date DATE
      )
    `);
  })
  .then(() => {
    console.log('✅ Table "expenses" is ready');
    process.exit(); // exit after table is created
  })
  .catch((err) => {
    console.error('❌ Error creating table:', err);
    process.exit(1);
  });



