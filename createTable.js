const pool = require('./db');

pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL');

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
