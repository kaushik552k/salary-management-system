import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { CURRENCIES } from '../schemas/employee.schema';
import {
  CreateEmployeeInput,
  UpdateEmployeeInput,
  ListQueryInput,
} from '../schemas/employee.schema';

// ─── Helper: generate a unique employee ID ───────────────────────────────────
async function generateEmployeeId(): Promise<string> {
  const count = await prisma.employee.count();
  return `EMP-${String(count + 1).padStart(5, '0')}`;
}

// ─── List employees with pagination, search, filters, sort ──────────────────
export async function listEmployees(query: ListQueryInput) {
  const {
    page,
    limit,
    search,
    department,
    country,
    jobLevel,
    employmentType,
    status,
    sortBy,
    sortOrder,
  } = query;

  const where: Prisma.EmployeeWhereInput = {
    ...(status ? { status } : { status: 'Active' }),
    ...(department && { department }),
    ...(country && { country }),
    ...(jobLevel && { jobLevel }),
    ...(employmentType && { employmentType }),
    ...(search && {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { employeeId: { contains: search } },
        { jobTitle: { contains: search } },
      ],
    }),
  };

  const [total, employees] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    data: employees,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ─── Get single employee ─────────────────────────────────────────────────────
export async function getEmployeeById(id: string) {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    throw new AppError(404, `Employee with id '${id}' not found`);
  }
  return employee;
}

// ─── Create employee ─────────────────────────────────────────────────────────
export async function createEmployee(input: CreateEmployeeInput) {
  // Check for duplicate email
  const existing = await prisma.employee.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new AppError(409, `An employee with email '${input.email}' already exists`);
  }

  const employeeId = await generateEmployeeId();
  const currency = CURRENCIES[input.country] ?? 'USD';

  return prisma.employee.create({
    data: {
      ...input,
      employeeId,
      currency,
      joiningDate: new Date(input.joiningDate),
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
    },
  });
}

// ─── Update employee ─────────────────────────────────────────────────────────
export async function updateEmployee(id: string, input: UpdateEmployeeInput) {
  // Ensure employee exists
  await getEmployeeById(id);

  // If email changed, check for conflicts
  if (input.email) {
    const conflict = await prisma.employee.findFirst({
      where: { email: input.email, NOT: { id } },
    });
    if (conflict) {
      throw new AppError(409, `Another employee with email '${input.email}' already exists`);
    }
  }

  // Auto-update currency if country changes
  const currency =
    input.country ? CURRENCIES[input.country] ?? 'USD' : undefined;

  return prisma.employee.update({
    where: { id },
    data: {
      ...input,
      ...(currency && { currency }),
      ...(input.joiningDate && { joiningDate: new Date(input.joiningDate) }),
      ...(input.dateOfBirth !== undefined && { dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null }),
    },
  });
}

// ─── Soft delete (mark Inactive) ─────────────────────────────────────────────
export async function deleteEmployee(id: string) {
  await getEmployeeById(id);
  return prisma.employee.update({
    where: { id },
    data: { status: 'Inactive' },
  });
}

// ─── Export all matching employees as CSV data ───────────────────────────────
export async function exportEmployees(query: ListQueryInput) {
  // Fetch all (no pagination) for export
  const { search, department, country, jobLevel, employmentType, status, sortBy, sortOrder } =
    query;

  const where: Prisma.EmployeeWhereInput = {
    ...(status ? { status } : {}),
    ...(department && { department }),
    ...(country && { country }),
    ...(jobLevel && { jobLevel }),
    ...(employmentType && { employmentType }),
    ...(search && {
      OR: [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { employeeId: { contains: search } },
      ],
    }),
  };

  return prisma.employee.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
  });
}
