import { render, screen } from '@testing-library/react';
import PieBreakdown from '../components/analytics/PieBreakdown';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="ResponsiveContainer">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="PieChart">{children}</div>,
  Pie: ({ children, data }: any) => (
    <div data-testid="Pie">
      {data.map((d: any, i: number) => (
        <span key={i} data-testid={`pie-slice-${d.name}`}>{d.value}</span>
      ))}
      {children}
    </div>
  ),
  Cell: () => <div data-testid="Cell" />,
  Tooltip: () => <div data-testid="Tooltip" />,
  Legend: () => <div data-testid="Legend" />,
}));

describe('PieBreakdown', () => {
  it('renders "No data" when data is empty', () => {
    render(<PieBreakdown title="Employment Types" data={[]} />);
    expect(screen.getByText('Employment Types')).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders chart when data is provided', () => {
    const data = [
      { name: 'Full-time', value: 100 },
      { name: 'Contract', value: 20 },
    ];
    render(<PieBreakdown title="Employment Types" data={data} />);
    
    expect(screen.getByText('Employment Types')).toBeInTheDocument();
    expect(screen.getByTestId('ResponsiveContainer')).toBeInTheDocument();
    expect(screen.getByTestId('pie-slice-Full-time')).toHaveTextContent('100');
    expect(screen.getByTestId('pie-slice-Contract')).toHaveTextContent('20');
  });
});
