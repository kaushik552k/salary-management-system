import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeForm from '../components/employees/EmployeeForm';
import { CreateEmployeePayload } from '../lib/api';

describe('EmployeeForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form sections', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Role & Organisation')).toBeInTheDocument();
    expect(screen.getByText('Compensation')).toBeInTheDocument();
    expect(screen.getByText('Tax & Statutory')).toBeInTheDocument();
    expect(screen.getByText('Payment Information')).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: 'Save' }));
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getAllByText('Required').length).toBeGreaterThan(0);
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup();
    render(<EmployeeForm onSubmit={mockOnSubmit} isSubmitting={false} />);

    // Fill personal info
    await user.type(screen.getByPlaceholderText('Alice'), 'John');
    await user.type(screen.getByPlaceholderText('Smith'), 'Doe');
    await user.type(screen.getByPlaceholderText('alice@acmecorp.com'), 'john.doe@example.com');

    const dobInput = document.querySelector('input[name="dateOfBirth"]') as HTMLElement;
    fireEvent.change(dobInput, { target: { value: '1990-01-01' } });

    // Fill role
    await user.type(screen.getByPlaceholderText('Senior Software Engineer'), 'Developer');
    
    const selects = document.querySelectorAll('select');
    await user.selectOptions(selects[0], 'Engineering'); // department
    await user.selectOptions(selects[1], 'Mid'); // jobLevel
    await user.selectOptions(selects[2], 'Full-time'); // employmentType
    await user.selectOptions(selects[3], 'United States'); // country
    
    const joinInput = document.querySelector('input[name="joiningDate"]') as HTMLElement;
    fireEvent.change(joinInput, { target: { value: '2023-01-01' } });

    // Fill compensation
    await user.type(screen.getByPlaceholderText('95000'), '80000');

    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData.firstName).toBe('John');
    expect(submittedData.lastName).toBe('Doe');
    expect(submittedData.email).toBe('john.doe@example.com');
    expect(submittedData.baseSalary).toBe(80000);
  });
  
  it('disables submit button when isSubmitting is true', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} isSubmitting={true} />);
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });
});
