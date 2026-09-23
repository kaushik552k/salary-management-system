import { render, screen } from '@testing-library/react';
import Sidebar from '../components/layout/Sidebar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from 'next/navigation';

describe('Sidebar', () => {
  it('renders the branding', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    render(<Sidebar />);
    
    expect(screen.getByText('ACME Corp')).toBeInTheDocument();
    expect(screen.getByText('Salary Management')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    render(<Sidebar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
  });

  it('highlights the active link', () => {
    (usePathname as jest.Mock).mockReturnValue('/employees');
    render(<Sidebar />);
    
    const employeesLink = screen.getByText('Employees').closest('a');
    expect(employeesLink).toHaveClass('text-indigo-600'); // Our active class

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).not.toHaveClass('text-indigo-600');
  });

  it('renders the user profile in the footer', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    render(<Sidebar />);
    
    expect(screen.getByText('HR Manager')).toBeInTheDocument();
    expect(screen.getByText('hr@acmecorp.com')).toBeInTheDocument();
  });
});
