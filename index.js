const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json()); // Parses JSON request body

app.use('/api/expenses', expenseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
