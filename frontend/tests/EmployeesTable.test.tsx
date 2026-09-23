import { render, screen, fireEvent } from '@testing-library/react';
import EmployeesTable from '../app/employees/EmployeesTable';
import { useEmployees, useDeleteEmployee } from '../hooks/use-employees';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('../hooks/use-employees');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('EmployeesTable', () => {
  const mockRouter = { push: jest.fn() };
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useDeleteEmployee as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
  });

  it('renders loading skeletons when isLoading is true', () => {
    (useEmployees as jest.Mock).mockReturnValue({ data: undefined, isLoading: true });
    
    const { container } = render(<EmployeesTable />);
    // Checking for loading skeletons
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders "No employees found" when data is empty', () => {
    (useEmployees as jest.Mock).mockReturnValue({
      data: { data: [], meta: { total: 0, totalPages: 0 } },
      isLoading: false,
    });
    
    render(<EmployeesTable />);
    expect(screen.getByText('No employees found')).toBeInTheDocument();
  });

  it('renders employee data correctly', () => {
    (useEmployees as jest.Mock).mockReturnValue({
      data: {
        data: [
          {
            id: '1',
            employeeId: 'EMP-001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            department: 'Engineering',
            jobLevel: 'Mid',
            country: 'USA',
            baseSalary: 100000,
            currency: 'USD',
            employmentType: 'Full-Time',
            joiningDate: '2023-01-01',
            status: 'Active',
          }
        ],
        meta: { total: 1, totalPages: 1 }
      },
      isLoading: false,
    });
    
    render(<EmployeesTable />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Engineering')[0]).toBeInTheDocument();
    expect(screen.getByText('EMP-001')).toBeInTheDocument();
    // Use regex to match $100,000.00 since currency formatting can vary
    expect(screen.getAllByText(/\$100,000/)[0]).toBeInTheDocument();
  });

  it('updates URL when searching', () => {
    (useEmployees as jest.Mock).mockReturnValue({
      data: { data: [], meta: { total: 0, totalPages: 0 } },
      isLoading: false,
    });
    
    render(<EmployeesTable />);
    
    const searchInput = screen.getByPlaceholderText('Search name, email, ID...');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    expect(mockRouter.push).toHaveBeenCalledWith('/employees?search=Alice&page=1');
  });
});
