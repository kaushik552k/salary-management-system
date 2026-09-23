import { USD_EXCHANGE_RATES } from '../src/schemas/employee.schema';

// We test the analytics logic in isolation by mocking prisma
jest.mock('../src/lib/prisma', () => {
  const mockPrisma = {
    employee: {
      count: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
  };
  return { __esModule: true, default: mockPrisma };
});

import prisma from '../src/lib/prisma';
import {
  getSummary,
  getByDepartment,
  getByCountry,
  getByLevel,
  getDistribution,
  getByEmploymentType,
} from '../src/services/analytics.service';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Analytics Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSummary', () => {
    it('returns correct KPIs for a known set of employees', async () => {
      (mockPrisma.employee.count as jest.Mock)
        .mockResolvedValueOnce(2) // active
        .mockResolvedValueOnce(3); // total

      (mockPrisma.employee.groupBy as jest.Mock).mockResolvedValueOnce([
        { currency: 'USD', _sum: { baseSalary: 100_000, bonus: 10_000 }, _max: { baseSalary: 100_000 }, _min: { baseSalary: 100_000 } },
        { currency: 'INR', _sum: { baseSalary: 8_300_000, bonus: null }, _max: { baseSalary: 8_300_000 }, _min: { baseSalary: 8_300_000 } },
      ]);

      const result = await getSummary();

      expect(result.activeEmployees).toBe(2);
      expect(result.totalEmployees).toBe(3);
      // ~100k + ~99.6k = ~199.6k
      expect(result.totalPayrollUSD).toBeGreaterThan(190_000);
      expect(result.totalPayrollUSD).toBeLessThan(210_000);
      expect(result.avgSalaryUSD).toBeGreaterThan(90_000);
    });

    it('returns zero values when no employees exist', async () => {
      (mockPrisma.employee.count as jest.Mock)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      (mockPrisma.employee.groupBy as jest.Mock).mockResolvedValueOnce([]);

      const result = await getSummary();

      expect(result.totalPayrollUSD).toBe(0);
      expect(result.avgSalaryUSD).toBe(0);
      expect(result.activeEmployees).toBe(0);
    });
  });

  describe('getByDepartment', () => {
    it('groups employees by department and calculates averages', async () => {
      (mockPrisma.employee.groupBy as jest.Mock).mockResolvedValueOnce([
        { department: 'Engineering', currency: 'USD', _sum: { baseSalary: 220_000 }, _count: { _all: 2 } },
        { department: 'HR', currency: 'USD', _sum: { baseSalary: 60_000 }, _count: { _all: 1 } },
      ]);

      const result = await getByDepartment();

      const eng = result.find((r) => r.department === 'Engineering');
      const hr = result.find((r) => r.department === 'HR');

      expect(eng).toBeDefined();
      expect(eng?.count).toBe(2);
      expect(eng?.avgSalaryUSD).toBe(110_000);
      expect(hr?.avgSalaryUSD).toBe(60_000);
    });

    it('sorts results by average salary descending', async () => {
      (mockPrisma.employee.groupBy as jest.Mock).mockResolvedValueOnce([
        { department: 'HR', currency: 'USD', _sum: { baseSalary: 60_000 }, _count: { _all: 1 } },
        { department: 'Engineering', currency: 'USD', _sum: { baseSalary: 120_000 }, _count: { _all: 1 } },
      ]);

      const result = await getByDepartment();

      expect(result[0].department).toBe('Engineering');
    });
  });

  describe('getByLevel', () => {
    it('returns levels in correct career ladder order', async () => {
      (mockPrisma.employee.groupBy as jest.Mock).mockResolvedValueOnce([
        { jobLevel: 'Senior', currency: 'USD', _sum: { baseSalary: 120_000 }, _count: { _all: 1 } },
        { jobLevel: 'Junior', currency: 'USD', _sum: { baseSalary: 60_000 }, _count: { _all: 1 } },
        { jobLevel: 'VP', currency: 'USD', _sum: { baseSalary: 280_000 }, _count: { _all: 1 } },
      ]);

      const result = await getByLevel();
      const levels = result.map((r) => r.level);

      expect(levels.indexOf('Junior')).toBeLessThan(levels.indexOf('Senior'));
      expect(levels.indexOf('Senior')).toBeLessThan(levels.indexOf('VP'));
    });
  });

  describe('getDistribution', () => {
    it('correctly buckets salaries', async () => {
      (mockPrisma.employee.findMany as jest.Mock).mockResolvedValueOnce([
        { baseSalary: 25_000, currency: 'USD' },    // < $30k bucket
        { baseSalary: 50_000, currency: 'USD' },    // $30k–60k bucket
        { baseSalary: 115_000, currency: 'USD' },   // $90k–120k bucket (115k < 120k)
        { baseSalary: 8_300_000, currency: 'INR' }, // 8.3M INR × 0.012 = 99,600 USD → $90k–120k
      ]);

      const result = await getDistribution();

      const under30 = result.find((b) => b.label === '< $30k');
      const bucket30_60 = result.find((b) => b.label === '$30k–60k');
      const bucket90_120 = result.find((b) => b.label === '$90k–120k');

      expect(under30?.count).toBe(1);
      expect(bucket30_60?.count).toBe(1);
      // Both 115k USD and ~99.6k USD (INR) fall in $90k–120k
      expect(bucket90_120?.count).toBe(2);
    });

    it('returns all 7 buckets even when empty', async () => {
      (mockPrisma.employee.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getDistribution();
      expect(result).toHaveLength(7);
    });
  });

  describe('USD_EXCHANGE_RATES', () => {
    it('contains USD rate of 1 (identity)', () => {
      expect(USD_EXCHANGE_RATES['USD']).toBe(1);
    });

    it('contains positive rates for all currencies', () => {
      Object.values(USD_EXCHANGE_RATES).forEach((rate) => {
        expect(rate).toBeGreaterThan(0);
      });
    });
  });
});
