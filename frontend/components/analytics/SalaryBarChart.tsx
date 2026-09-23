'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatUSD } from '@/lib/utils';

interface DataPoint {
  name: string;
  value: number;
  count: number;
}

interface Props {
  title: string;
  data: DataPoint[];
  color: string;
  valueLabel?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  valueLabel,
}: {
  active?: boolean;
  payload?: { value: number; payload: DataPoint }[];
  label?: string;
  valueLabel?: string;
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl text-xs">
      <p className="font-semibold text-slate-200 mb-1">{label}</p>
      <p className="text-slate-300">
        {valueLabel ?? 'Avg Salary'}:{' '}
        <span className="text-white font-bold">
          {valueLabel ? d.value.toLocaleString() : formatUSD(d.value)}
        </span>
      </p>
      <p className="text-slate-400">Headcount: {d.payload.count.toLocaleString()}</p>
    </div>
  );
};

export default function SalaryBarChart({ title, data, color, valueLabel }: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-6">{title}</h3>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
          No data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 40, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) => (valueLabel ? v.toLocaleString() : `$${(v / 1000).toFixed(0)}k`)}
              width={55}
            />
            <Tooltip content={<CustomTooltip valueLabel={valueLabel} />} cursor={{ fill: '#1e293b' }} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
