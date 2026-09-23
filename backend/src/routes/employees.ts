import { Router, Request, Response, NextFunction } from 'express';
import {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  exportEmployees,
} from '../services/employee.service';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  listQuerySchema,
} from '../schemas/employee.schema';

export const employeeRouter = Router();

// ─── GET /api/employees ──────────────────────────────────────────────────────
employeeRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const result = await listEmployees(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/employees/export ───────────────────────────────────────────────
employeeRouter.get('/export', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const employees = await exportEmployees(query);

    const headers = [
      'Employee ID',
      'First Name',
      'Last Name',
      'Email',
      'Department',
      'Job Title',
      'Job Level',
      'Employment Type',
      'Country',
      'Currency',
      'Base Salary',
      'Bonus',
      'Joining Date',
      'Status',
    ];

    const rows = employees.map((e) => [
      e.employeeId,
      e.firstName,
      e.lastName,
      e.email,
      e.department,
      e.jobTitle,
      e.jobLevel,
      e.employmentType,
      e.country,
      e.currency,
      e.baseSalary,
      e.bonus ?? '',
      e.joiningDate.toISOString().split('T')[0],
      e.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="employees.csv"');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/employees/:id ──────────────────────────────────────────────────
employeeRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/employees ─────────────────────────────────────────────────────
employeeRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createEmployeeSchema.parse(req.body);
    const employee = await createEmployee(input);
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/employees/:id ──────────────────────────────────────────────────
employeeRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateEmployeeSchema.parse(req.body);
    const employee = await updateEmployee(req.params.id, input);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/employees/:id ───────────────────────────────────────────────
employeeRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteEmployee(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
