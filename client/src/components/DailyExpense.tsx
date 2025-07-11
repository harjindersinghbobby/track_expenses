// components/DailyExpenseChart.tsx
import {  XAxis, YAxis, Tooltip, ResponsiveContainer,AreaChart,Area } from 'recharts';

type Props = {
  data: { day: string; total: string }[];
};

const DailyExpenseChart = ({ data }: Props) => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3 style={{ marginBottom: '1rem' }}>📅 Daily Expense Trend</h3>
      <ResponsiveContainer>
 <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
  <defs>
    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="day" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" />
</AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyExpenseChart;
