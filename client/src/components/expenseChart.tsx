import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type Expense = {
  title: string;
  amount: number;
  category: string;
  date: string;
};

type Props = {
  data: Expense[];
};

const ExpenseChart: React.FC<Props> = ({ data }) => {
  // Group totals by category
  const chartData = Object.values(
    data.reduce<Record<string, { category: string; total: number }>>((acc, expense) => {
      const cat = expense.category || 'Other';
      acc[cat] = acc[cat] || { category: cat, total: 0 };
      acc[cat].total += expense.amount;
      return acc;
    }, {})
  );

  return (
    <div style={{ height: '300px', marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>Expenses by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;