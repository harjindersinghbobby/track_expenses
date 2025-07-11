import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const MonthlyComparison = ({data} : any) => {



  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📊 Monthly Comparison</h2>
      {/* <p style={{ fontSize: '0.95rem', color: '#4b5563' }}>{summary}</p> */}

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
