import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

type MonthData = {
  month: string;
  total: number;
};

const MonthlyLineChart = ({monthlyExpensesData} : {monthlyExpensesData: MonthData[]}) => {



  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📈 Monthly Expense Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyExpensesData}>
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
