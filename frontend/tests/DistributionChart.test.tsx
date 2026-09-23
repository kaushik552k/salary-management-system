import { render, screen } from '@testing-library/react';
import DistributionChart from '../components/analytics/DistributionChart';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="ResponsiveContainer">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="BarChart">{children}</div>,
  Bar: () => <div data-testid="Bar" />,
  XAxis: () => <div data-testid="XAxis" />,
  YAxis: () => <div data-testid="YAxis" />,
  CartesianGrid: () => <div data-testid="CartesianGrid" />,
  Tooltip: () => <div data-testid="Tooltip" />,
}));

describe('DistributionChart', () => {
  it('renders "No data" when data is empty', () => {
    render(<DistributionChart data={[]} />);
    expect(screen.getByText('Salary Distribution (USD)')).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders chart when data is provided', () => {
    const data = [
      { label: '<$50k', count: 10 },
      { label: '$50k-$100k', count: 50 },
    ];
    render(<DistributionChart data={data} />);
    
    expect(screen.getByText('Salary Distribution (USD)')).toBeInTheDocument();
    expect(screen.getByTestId('ResponsiveContainer')).toBeInTheDocument();
    expect(screen.getByTestId('BarChart')).toBeInTheDocument();
  });
});
