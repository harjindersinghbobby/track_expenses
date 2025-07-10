import  { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../services/api';

type MonthData = {
  month: string;
  total: number;
};

const MonthlyLineChart = () => {
  const [data, setData] = useState<MonthData[]>([]);

  useEffect(() => {
    const fetchMonthlySummary = async () => {
      try {
        const res = await api.get('/expenses/monthly-summary');
        const formatted = res.data.map((item: any) => ({
          month: item.month,
          total: item.total,
        }));
        setData(formatted);
      } catch (err) {
        console.error('❌ Failed to fetch monthly summary:', err);
      }
    };

    fetchMonthlySummary();
  }, []);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📈 Monthly Expense Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyLineChart;
