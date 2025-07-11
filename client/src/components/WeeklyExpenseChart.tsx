import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts';

type Props = {
  data: { label: string; total: number }[];
};

const WeeklyExpenseChart = ({ data }: Props) => {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <h3 style={{ marginBottom: '1rem' }}>📆 Weekly Expenses (Last 8 Weeks)</h3>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" angle={-30} height={50} />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#10b981"
            fill="url(#colorTotal)"
            strokeWidth={2}
            dot={{ stroke: '#065f46', strokeWidth: 2, r: 4 }}
          />

          {/* Add vertical week separator lines */}
          {data.map((entry, index) => (
            <ReferenceLine
              key={index}
              x={entry.label}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyExpenseChart;
