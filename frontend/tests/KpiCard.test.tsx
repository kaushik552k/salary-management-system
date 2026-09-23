import { render, screen } from '@testing-library/react';
import KpiCard from '../components/analytics/KpiCard';

describe('KpiCard', () => {
  it('renders the title and value', () => {
    render(<KpiCard title="Total Employees" value="1,000" icon={<span data-testid="icon">icon</span>} />);
    
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders a loading skeleton when loading is true', () => {
    const { container } = render(<KpiCard title="Loading KPI" value="0" icon={<span />} loading={true} />);
    
    expect(screen.getByText('Loading KPI')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    // Assuming animate-pulse class is applied to the skeleton
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('applies the correct accent color class', () => {
    const { container } = render(<KpiCard title="Accent KPI" value="5" icon={<span />} accent="emerald" />);
    // The accent container should have the 'bg-emerald-50' class
    expect(container.querySelector('.bg-emerald-50')).toBeInTheDocument();
  });
});
