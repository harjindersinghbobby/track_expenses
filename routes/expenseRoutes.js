const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/expenses

router.get('/monthly-summary', async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `
      SELECT TO_CHAR(date, 'YYYY-MM') AS month,
             SUM(amount)::float AS total
      FROM expenses
      WHERE user_id = $1
      GROUP BY month
      ORDER BY month ASC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Failed to fetch monthly summary:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});


router.get('/compare', async (req, res) => {
  const { month } = req.query;
  const userId = req.user.id;

  try {
    if (!month) return res.status(400).json({ error: 'Month is required' });

    const [year, monthNum] = month.split('-');
    const prevMonth = new Date(`${month}-01`);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevStr = prevMonth.toISOString().slice(0, 7);

    const current = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2
       GROUP BY category`,
      [userId, month]
    );

    const previous = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM expenses
       WHERE user_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2
       GROUP BY category`,
      [userId, prevStr]
    );

    res.json({
      currentMonth: month,
      previousMonth: prevStr,
      currentData: current.rows,
      previousData: previous.rows
    });
  } catch (err) {
    console.error('❌ Comparison error:', err);
    res.status(500).json({ error: 'Comparison failed' });
  }
});

router.get('/all-expenses', async (req, res) => {
  const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
  res.json(result.rows);
});

router.get('/all-users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { title, amount, category, date } = req.body;
const userId = req.user.id;


  try {
 
    const result = await pool.query(
      `INSERT INTO expenses (title, amount, category, date, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, amount, category, date, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error saving expense:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
   const result = await pool.query(
  'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
  [req.user.id]
);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
  'DELETE FROM expenses WHERE id = $1 AND user_id = $2',
  [id, req.user.id]
);
    res.status(204).send();
  } catch (err) {
    console.error('❌ Error deleting:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date } = req.body;

  try {
const result = await pool.query(
  `
  UPDATE expenses
  SET title = $1,
      amount = $2,
      category = $3,
      date = $4
  WHERE id = $5 AND user_id = $6
  RETURNING *
  `,
  [title, amount, category, date, id, req.user.id]
);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Failed to update expense:', err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});


module.exports = router;
