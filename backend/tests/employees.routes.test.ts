import request from 'supertest';
import { createApp } from '../src/app';

// Mock Prisma so tests run without a real database
jest.mock('../src/lib/prisma', () => {
  const mockPrisma = {
    employee: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { __esModule: true, default: mockPrisma };
});

import prisma from '../src/lib/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const app = createApp();

const MOCK_EMPLOYEE = {
  id: 'uuid-1',
  employeeId: 'EMP-00001',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@acmecorp.com',
  department: 'Engineering',
  jobTitle: 'Software Engineer',
  jobLevel: 'Mid',
  employmentType: 'Full-time',
  country: 'United States',
  currency: 'USD',
  baseSalary: 100_000,
  bonus: 10_000,
  joiningDate: new Date('2022-06-01'),
  status: 'Active',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/employees', () => {
  beforeEach(() => {
    (mockPrisma.employee.count as jest.Mock).mockResolvedValue(1);
    (mockPrisma.employee.findMany as jest.Mock).mockResolvedValue([MOCK_EMPLOYEE]);
  });

  it('returns paginated employee list', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);
  });

  it('returns 400 for invalid page param', async () => {
    const res = await request(app).get('/api/employees?page=-1');
    expect(res.status).toBe(400);
  });

  it('returns 400 for limit exceeding max (200)', async () => {
    const res = await request(app).get('/api/employees?limit=9999');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/employees/:id', () => {
  it('returns 200 with employee when found', async () => {
    (mockPrisma.employee.findUnique as jest.Mock).mockResolvedValue(MOCK_EMPLOYEE);
    const res = await request(app).get('/api/employees/uuid-1');
    expect(res.status).toBe(200);
    expect(res.body.employeeId).toBe('EMP-00001');
  });

  it('returns 404 when employee not found', async () => {
    (mockPrisma.employee.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/api/employees/nonexistent-id');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/employees', () => {
  const validPayload = {
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@acmecorp.com',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    jobLevel: 'Mid',
    employmentType: 'Full-time',
    country: 'United States',
    baseSalary: 95_000,
    joiningDate: '2024-01-15',
  };

  it('creates an employee and returns 201', async () => {
    (mockPrisma.employee.findUnique as jest.Mock).mockResolvedValue(null);
    (mockPrisma.employee.count as jest.Mock).mockResolvedValue(1);
    (mockPrisma.employee.create as jest.Mock).mockResolvedValue({
      ...MOCK_EMPLOYEE,
      ...validPayload,
    });

    const res = await request(app).post('/api/employees').send(validPayload);
    expect(res.status).toBe(201);
  });

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ firstName: 'Bob' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ ...validPayload, email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative salary', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ ...validPayload, baseSalary: -5000 });
    expect(res.status).toBe(400);
  });

  it('returns 409 when email already exists', async () => {
    (mockPrisma.employee.findUnique as jest.Mock).mockResolvedValue(MOCK_EMPLOYEE);
    const res = await request(app).post('/api/employees').send(validPayload);
    expect(res.status).toBe(409);
  });
});

describe('PUT /api/employees/:id', () => {
  it('updates employee and returns 200', async () => {
    (mockPrisma.employee.findUnique as jest.Mock).mockResolvedValue(MOCK_EMPLOYEE);
    (mockPrisma.employee.findFirst as jest.Mock).mockResolvedValue(null);
    (mockPrisma.employee.update as jest.Mock).mockResolvedValue({
      ...MOCK_EMPLOYEE,
      baseSalary: 110_000,
    });

    const res = await request(app)
      .put('/api/employees/uuid-1')
      .send({ baseSalary: 110_000 });

    expect(res.status).toBe(200);
    expect(res.body.baseSalary).toBe(110_000);
  });

  it('returns 404 for non-existent employee', async () => {
    (mockPrisma.employee.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app)
      .put('/api/employees/ghost-id')
      .send({ baseSalary: 110_000 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/employees/:id', () => {
  it('soft-deletes employee and returns 204', async () => {
    (mockPrisma.employee.findUnique as jest.Mock).mockResolvedValue(MOCK_EMPLOYEE);
    (mockPrisma.employee.update as jest.Mock).mockResolvedValue({
      ...MOCK_EMPLOYEE,
      status: 'Inactive',
    });

    const res = await request(app).delete('/api/employees/uuid-1');
    expect(res.status).toBe(204);
  });

  it('returns 404 for non-existent employee', async () => {
    (mockPrisma.employee.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).delete('/api/employees/ghost-id');
    expect(res.status).toBe(404);
  });
});

describe('404 route', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});
