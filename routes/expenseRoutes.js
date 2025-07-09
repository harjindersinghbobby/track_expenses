const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/expenses
router.post('/', async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO expenses (title, amount, category, date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, amount, category, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error saving expense:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
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
      WHERE id = $5
      RETURNING *
      `,
      [title, amount, category, date, id]
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
