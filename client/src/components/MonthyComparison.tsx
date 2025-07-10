import  { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

type CategoryData = {
  category: string;
  current: number;
  previous: number;
};

const MonthlyComparison = ({ selectedMonth }: { selectedMonth: string }) => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const res = await api.get(`/expenses/compare?month=${selectedMonth}`);
        const map: { [category: string]: CategoryData } = {};

        res.data.previousData.forEach((item: any) => {
          map[item.category] = {
            category: item.category,
            previous: parseFloat(item.total),
            current: 0,
          };
        });

        res.data.currentData.forEach((item: any) => {
          if (!map[item.category]) {
            map[item.category] = {
              category: item.category,
              previous: 0,
              current: parseFloat(item.total),
            };
          } else {
            map[item.category].current = parseFloat(item.total);
          }
        });

        const result = Object.values(map);
        setData(result);

        // Generate summary
        const summaryText = result
          .map((item) => {
            const diff = item.current - item.previous;
            const symbol = diff >= 0 ? '↑' : '↓';
            return `${item.category}: ₹${Math.abs(diff).toFixed(2)} ${symbol}`;
          })
          .join(' | ');
        setSummary(summaryText);
      } catch (err) {
        console.error('❌ Failed to fetch comparison', err);
      }
    };

    if (selectedMonth) fetchComparison();
  }, [selectedMonth]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📊 Monthly Comparison</h2>
      <p style={{ fontSize: '0.95rem', color: '#4b5563' }}>{summary}</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="previous" fill="#93c5fd" name="Previous Month" />
          <Bar dataKey="current" fill="#60a5fa" name="Current Month" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyComparison;
