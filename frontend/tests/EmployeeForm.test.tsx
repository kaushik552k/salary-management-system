import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeForm from '../components/employees/EmployeeForm';

describe('EmployeeForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sections', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Role & Organisation')).toBeInTheDocument();
    expect(screen.getByText('Compensation')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    
    const submitBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Multiple "Required" messages should appear
      const requiredMessages = screen.getAllByText('Required');
      expect(requiredMessages.length).toBeGreaterThan(0);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup();
    render(<EmployeeForm onSubmit={mockOnSubmit} isSubmitting={false} />);

    await user.type(screen.getByPlaceholderText('Alice'), 'John');
    await user.type(screen.getByPlaceholderText('Smith'), 'Doe');
    await user.type(screen.getByPlaceholderText('alice@acmecorp.com'), 'john@example.com');
    
    // For selects, they don't have placeholders, but we can query by role 'combobox'
    const selects = screen.getAllByRole('combobox');
    // 0: department, 1: level, 2: type, 3: country
    await user.selectOptions(selects[0], 'Engineering');
    await user.type(screen.getByPlaceholderText('Senior Software Engineer'), 'Developer');
    await user.selectOptions(selects[1], 'Mid');
    await user.selectOptions(selects[2], 'Full-time');
    await user.selectOptions(selects[3], 'United States');
    
    // date input (first date/number input)
    const inputs = screen.getAllByRole('spinbutton');
    // Wait, date is not a spinbutton
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) fireEvent.change(dateInput, { target: { value: '2024-01-01' } });

    await user.type(screen.getByPlaceholderText('95000'), '100000');

    const submitBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          department: 'Engineering',
          baseSalary: 100000,
        })
      );
    });
  });

  it('disables the submit button when isSubmitting is true', () => {
    render(<EmployeeForm onSubmit={mockOnSubmit} isSubmitting={true} submitLabel="Saving..." />);
    
    const submitBtn = screen.getByRole('button', { name: 'Saving...' });
    expect(submitBtn).toBeDisabled();
  });
});
