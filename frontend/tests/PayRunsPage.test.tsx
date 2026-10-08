import { render, screen, waitFor } from '@testing-library/react';
import PayRunsPage from '../app/pay-runs/page';
import { useAnalyticsSummary, useRecentPayRuns, usePayrollComponents, usePayRunSummary } from '../hooks/use-analytics';
import { useEmployees } from '../hooks/use-employees';

jest.mock('../hooks/use-analytics', () => ({
  useAnalyticsSummary: jest.fn(),
  useRecentPayRuns: jest.fn(),
  usePayrollComponents: jest.fn(),
  usePayRunSummary: jest.fn(),
}));

jest.mock('../hooks/use-employees', () => ({
  useEmployees: jest.fn(),
}));

describe('PayRunsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAnalyticsSummary as jest.Mock).mockReturnValue({ data: null });
    (usePayRunSummary as jest.Mock).mockReturnValue({ data: null });
    (useRecentPayRuns as jest.Mock).mockReturnValue({ data: [] });
    (usePayrollComponents as jest.Mock).mockReturnValue({ data: [] });
    (useEmployees as jest.Mock).mockReturnValue({ data: null, isLoading: true });
  });

  it('renders loading state initially', () => {
    render(<PayRunsPage />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders payload data when loaded', () => {
    const mockSummary = { monthlyPayroll: 1200000, monthlyPayrollINR: 1200000, activeEmployees: 2 };
    const mockPayRunSummary = {
      totalGross: 1800000,
      totalDeductions: 360000,
      totalNet: 1440000,
      currency: 'USD',
      currencySymbol: '$',
    };
    const mockComponents = [
      { component: 'Basic', amount: 500000, amountINR: 500000, percentage: 50 },
      { component: 'Allowances', amount: 200000, amountINR: 200000, percentage: 20 },
      { component: 'Employer EPF', amount: 50000, amountINR: 50000, percentage: 5 },
      { component: 'Employer ESI', amount: 10000, amountINR: 10000, percentage: 1 },
      { component: 'Other Components', amount: 5000, amountINR: 5000, percentage: 0.5 },
    ];
    const mockEmployees = {
      data: [
        {
          id: 'emp-1', employeeId: 'EMP001', firstName: 'Alice', lastName: 'Smith', currency: 'USD',
          baseSalary: 1200000, allowances: 200000, epfPercent: 12, esiPercent: 0, professionalTax: 200, tdsPercent: 10
        },
        {
          id: 'emp-2', employeeId: 'EMP002', firstName: 'Bob', lastName: 'Jones', currency: 'USD',
          baseSalary: 600000, allowances: 0, epfPercent: 12, esiPercent: 0, professionalTax: 200, tdsPercent: 10
        }
      ]
    };

    (useAnalyticsSummary as jest.Mock).mockReturnValue({ data: mockSummary });
    (usePayRunSummary as jest.Mock).mockReturnValue({ data: mockPayRunSummary });
    (usePayrollComponents as jest.Mock).mockReturnValue({ data: mockComponents });
    (useEmployees as jest.Mock).mockReturnValue({ data: mockEmployees, isLoading: false });

    render(<PayRunsPage />);

    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    
    // Check summary cards
    expect(screen.getByText('Payroll Cost')).toBeInTheDocument();
    expect(screen.getByText('Employees\' Net Pay')).toBeInTheDocument();
    
    // Check taxes rendering from components
    expect(screen.getByText('Employer EPF')).toBeInTheDocument();
  });

  it('renders empty list correctly', () => {
    (useEmployees as jest.Mock).mockReturnValue({ data: { data: [] }, isLoading: false });
    render(<PayRunsPage />);
    
    expect(screen.queryByText('Showing')).not.toBeInTheDocument();
    // Verify no skeleton is rendered
    expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument();
  });
});
