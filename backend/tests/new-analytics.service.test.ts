import {
  getPayrollTrend,
  getPayrollComponents,
  getComplianceStatus,
  getRecentPayRuns,
} from '../src/services/analytics.service';
import { prisma } from '../src/lib/prisma';

// Mock Prisma
jest.mock('../src/lib/prisma', () => ({
  prisma: {
    employee: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('New Analytics Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPayrollTrend', () => {
    it('returns empty array when no employees exist', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue([]);
      const trend = await getPayrollTrend();
      expect(trend).toEqual([]);
    });

    it('calculates payroll trend based on joining date and status', async () => {
      const mockEmployees = [
        { joiningDate: new Date('2023-01-01'), status: 'Active', baseSalary: 100000, currency: 'USD', allowances: 20000 },
        { joiningDate: new Date('2023-01-01'), status: 'Inactive', baseSalary: 50000, currency: 'USD' }
      ];
      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockEmployees);
      const trend = await getPayrollTrend();
      expect(trend.length).toBe(6);
      expect(trend[5].headcount).toBe(1);
    });
  });

  describe('getPayrollComponents', () => {
    it('returns empty array when no employees exist', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue([]);
      const components = await getPayrollComponents();
      expect(components).toEqual([]);
    });

    it('calculates components accurately', async () => {
      const mockEmployees = [
        {
          baseSalary: 1000, allowances: 200, currency: 'USD',
          epfPercent: 12, esiPercent: 0, professionalTax: 2, tdsPercent: 10
        }
      ];
      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockEmployees);
      const components = await getPayrollComponents();
      expect(components.length).toBe(5);
      expect(components.map(c => c.component)).toEqual(['Base Salary', 'Allowances', 'EPF & ESI', 'TDS', 'Professional Tax']);
    });
  });

  describe('getComplianceStatus', () => {
    it('returns compliant status when all is good', async () => {
      (prisma.employee.count as jest.Mock).mockResolvedValueOnce(100) // epf
        .mockResolvedValueOnce(0) // esi
        .mockResolvedValueOnce(100) // pt
        .mockResolvedValueOnce(0); // tds
      const status = await getComplianceStatus();
      expect(status[0].status).toBe('Compliant');
    });

    it('returns needs attention when missing data', async () => {
      (prisma.employee.count as jest.Mock).mockResolvedValueOnce(100) // epf missing
        .mockResolvedValueOnce(0) // esi missing
        .mockResolvedValueOnce(5) // pt missing
        .mockResolvedValueOnce(0); // tds missing
      const status = await getComplianceStatus();
      expect(status[2].status).toBe('Needs Attention');
      expect(status[2].details).toBe('5 active employees missing PT data in India');
    });
  });

  describe('getRecentPayRuns', () => {
    it('returns a mocked list of recent pay runs with correct math', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue([
        { baseSalary: 120000, currency: 'USD', allowances: 0 } // 10k/mo USD -> 8.3L INR
      ]);
      const runs = await getRecentPayRuns();
      expect(runs.length).toBe(3);
      expect(runs[0].headcount).toBe(1);
      expect(runs[0].totalPayrollINR).toBeGreaterThan(0);
    });
  });
});
