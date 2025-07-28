import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

export default function StockChart({ data }) {
  const formatXAxis = (date) => {
    return dayjs(date).format('MMM D');
  };

  const formatTooltip = (value) => {
    return `₹${value.toFixed(2)}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Price History</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="Date" 
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `₹${value}`}
              domain={['auto', 'auto']}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => dayjs(label).format('MMMM D, YYYY')}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.5rem',
                padding: '1rem',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="Close"
              stroke="#4F46E5"
              fill="url(#colorClose)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
