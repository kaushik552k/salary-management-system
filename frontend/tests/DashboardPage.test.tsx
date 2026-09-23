import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/dashboard/page';

jest.mock('../hooks/use-analytics', () => ({
  useAnalyticsSummary: jest.fn().mockReturnValue({ data: { activeEmployees: 10, monthlyPayrollINR: 50000 }, isLoading: false }),
  useByDepartment: jest.fn().mockReturnValue({ data: [] }),
  useByCountry: jest.fn().mockReturnValue({ data: [] }),
  useByLevel: jest.fn().mockReturnValue({ data: [] }),
  useDistribution: jest.fn().mockReturnValue({ data: [] }),
  useByEmploymentType: jest.fn().mockReturnValue({ data: [] }),
  usePayrollTrend: jest.fn().mockReturnValue({ data: [] }),
  usePayrollComponents: jest.fn().mockReturnValue({ data: [] }),
  useCompliance: jest.fn().mockReturnValue({ data: [] }),
  useRecentPayRuns: jest.fn().mockReturnValue({ data: [] }),
}));

jest.mock('../components/analytics/KpiCard', () => function MockKpiCard({ title, value }: any) {
  return <div data-testid="kpicard">{title}: {value}</div>;
});
jest.mock('../components/analytics/SalaryBarChart', () => function MockSalaryBarChart({ title }: any) {
  return <div data-testid="barchart">{title}</div>;
});
jest.mock('../components/analytics/PieBreakdown', () => function MockPieBreakdown({ title }: any) {
  return <div data-testid="piechart">{title}</div>;
});
jest.mock('../components/analytics/PayrollTrendChart', () => function MockTrend() {
  return <div data-testid="trendchart">Trend</div>;
});
jest.mock('../components/analytics/ComplianceWidget', () => function MockCompliance() {
  return <div data-testid="compliance">Compliance</div>;
});
jest.mock('../components/analytics/RecentPayRuns', () => function MockRuns() {
  return <div data-testid="recentruns">Runs</div>;
});

describe('DashboardPage', () => {
  it('renders the header and KPIs', () => {
    render(<DashboardPage />);
    expect(screen.getAllByTestId('kpicard').length).toBe(4);
    expect(screen.getAllByTestId('barchart').length).toBe(2);
    expect(screen.getByTestId('piechart')).toBeInTheDocument();
    expect(screen.getByTestId('trendchart')).toBeInTheDocument();
    expect(screen.getByTestId('compliance')).toBeInTheDocument();
    expect(screen.getByTestId('recentruns')).toBeInTheDocument();
  });
});
