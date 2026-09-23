import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployeesTable from '../app/employees/EmployeesTable';
import { useEmployees, useDeleteEmployee } from '../hooks/use-employees';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../hooks/use-employees', () => ({
  useEmployees: jest.fn(),
  useDeleteEmployee: jest.fn(),
}));

const mockPush = jest.fn();
const mockMutateAsync = jest.fn();

describe('EmployeesTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => null,
      toString: () => '',
    });
    (useDeleteEmployee as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
  });

  it('renders loading state initially', () => {
    (useEmployees as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    render(<EmployeesTable />);
    expect(screen.getByText('Employees')).toBeInTheDocument();
    // It should render skeleton rows
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders empty state when no employees found', () => {
    (useEmployees as jest.Mock).mockReturnValue({ data: { data: [], meta: { total: 0, totalPages: 1 } }, isLoading: false });
    render(<EmployeesTable />);
    expect(screen.getByText('No employees found')).toBeInTheDocument();
  });

  it('renders employee data correctly', () => {
    const mockData = {
      data: [
        {
          id: 'emp-1', employeeId: 'EMP001', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com',
          department: 'Engineering', jobLevel: 'Mid', country: 'India', baseSalary: 100000, currency: 'INR',
          employmentType: 'Full-time', joiningDate: '2023-01-01', status: 'Active'
        }
      ],
      meta: { total: 1, totalPages: 1 }
    };
    (useEmployees as jest.Mock).mockReturnValue({ data: mockData, isLoading: false });
    
    render(<EmployeesTable />);
    
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getAllByText('alice@example.com').length).toBeGreaterThan(0);
    expect(screen.getByText('EMP001')).toBeInTheDocument();
    expect(screen.getAllByText('Engineering').length).toBeGreaterThan(0);
  });

  it('calls delete mutation when delete button is clicked and confirmed', async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    
    const mockData = {
      data: [{ id: 'emp-1', employeeId: 'EMP001', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', department: 'Engineering', jobLevel: 'Mid', country: 'India', baseSalary: 100000, currency: 'INR', employmentType: 'Full-time', joiningDate: '2023-01-01', status: 'Active' }],
      meta: { total: 1, totalPages: 1 }
    };
    (useEmployees as jest.Mock).mockReturnValue({ data: mockData, isLoading: false });
    
    render(<EmployeesTable />);
    
    const deleteButton = document.querySelector('button'); // Trash icon button
    expect(deleteButton).toBeInTheDocument();
    
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(window.confirm).toHaveBeenCalled();
      expect(mockMutateAsync).toHaveBeenCalledWith('emp-1');
    }
  });

  it('updates URL params when searching', () => {
    (useEmployees as jest.Mock).mockReturnValue({ data: null, isLoading: true });
    render(<EmployeesTable />);
    
    const searchInput = screen.getByPlaceholderText('Search name, email, ID...');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('search=Alice'));
  });
});
