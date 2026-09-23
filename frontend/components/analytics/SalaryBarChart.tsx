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
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-800 mb-1">{label}</p>
      <p className="text-slate-600">
        {valueLabel ?? 'Avg Salary'}:{' '}
        <span className="text-slate-900 font-bold">
          {valueLabel ? d.value.toLocaleString() : formatUSD(d.value)}
        </span>
      </p>
      <p className="text-slate-400">Headcount: {d.payload.count.toLocaleString()}</p>
    </div>
  );
};

export default function SalaryBarChart({ title, data, color, valueLabel }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-6">{title}</h3>
      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 40, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => (valueLabel ? v.toLocaleString() : `$${(v / 1000).toFixed(0)}k`)}
              width={55}
            />
            <Tooltip content={<CustomTooltip valueLabel={valueLabel} />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
