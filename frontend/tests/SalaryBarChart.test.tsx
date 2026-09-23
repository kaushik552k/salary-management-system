import { render, screen } from '@testing-library/react';
import SalaryBarChart from '../components/analytics/SalaryBarChart';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="ResponsiveContainer">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="BarChart">{children}</div>,
  Bar: () => <div data-testid="Bar" />,
  XAxis: () => <div data-testid="XAxis" />,
  YAxis: () => <div data-testid="YAxis" />,
  CartesianGrid: () => <div data-testid="CartesianGrid" />,
  Tooltip: () => <div data-testid="Tooltip" />,
}));

describe('SalaryBarChart', () => {
  it('renders "No data" when data is empty', () => {
    render(<SalaryBarChart title="Test Chart" data={[]} color="#000" />);
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders chart when data is provided', () => {
    const data = [
      { name: 'Engineering', value: 100000, count: 10 },
      { name: 'HR', value: 80000, count: 5 },
    ];
    render(<SalaryBarChart title="Test Chart" data={data} color="#000" />);
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByTestId('ResponsiveContainer')).toBeInTheDocument();
    expect(screen.getByTestId('BarChart')).toBeInTheDocument();
  });
});
