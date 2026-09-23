import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/dashboard/page';

// Mock the hooks
jest.mock('../hooks/use-analytics', () => ({
  useAnalyticsSummary: jest.fn().mockReturnValue({ data: null, isLoading: true }),
  useByDepartment: jest.fn().mockReturnValue({ data: [] }),
  useByCountry: jest.fn().mockReturnValue({ data: [] }),
  useByLevel: jest.fn().mockReturnValue({ data: [] }),
  useDistribution: jest.fn().mockReturnValue({ data: [] }),
  useByEmploymentType: jest.fn().mockReturnValue({ data: [] }),
}));

// Mock the child components to avoid recharts rendering issues and simplify tests
jest.mock('../components/analytics/KpiCard', () => {
  return function MockKpiCard({ title, value }: any) {
    return <div data-testid="kpicard">{title}: {value}</div>;
  };
});
jest.mock('../components/analytics/SalaryBarChart', () => {
  return function MockSalaryBarChart({ title }: any) {
    return <div data-testid="barchart">{title}</div>;
  };
});
jest.mock('../components/analytics/DistributionChart', () => {
  return function MockDistributionChart() {
    return <div data-testid="distchart">DistributionChart</div>;
  };
});
jest.mock('../components/analytics/PieBreakdown', () => {
  return function MockPieBreakdown({ title }: any) {
    return <div data-testid="piechart">{title}</div>;
  };
});

describe('DashboardPage', () => {
  it('renders the header and loading KPIs', () => {
    render(<DashboardPage />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    const kpiCards = screen.getAllByTestId('kpicard');
    expect(kpiCards.length).toBe(6);
    expect(kpiCards[0]).toHaveTextContent('Active Employees: —');
  });

  it('renders all charts', () => {
    render(<DashboardPage />);
    
    expect(screen.getAllByTestId('barchart').length).toBe(3); // Dept, Level, Country
    expect(screen.getByTestId('distchart')).toBeInTheDocument();
    expect(screen.getByTestId('piechart')).toHaveTextContent('Employment Types');
  });
});
