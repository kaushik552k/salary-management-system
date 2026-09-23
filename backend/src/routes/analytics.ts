import { Router, Request, Response, NextFunction } from 'express';
import {
  getSummary,
  getByDepartment,
  getByCountry,
  getByLevel,
  getDistribution,
  getByEmploymentType,
} from '../services/analytics.service';

export const analyticsRouter = Router();

analyticsRouter.get('/summary', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getSummary());
  } catch (err) {
    next(err);
  }
});

analyticsRouter.get('/by-department', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getByDepartment());
  } catch (err) {
    next(err);
  }
});

analyticsRouter.get('/by-country', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getByCountry());
  } catch (err) {
    next(err);
  }
});

analyticsRouter.get('/by-level', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getByLevel());
  } catch (err) {
    next(err);
  }
});

analyticsRouter.get('/distribution', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getDistribution());
  } catch (err) {
    next(err);
  }
});

analyticsRouter.get('/by-employment-type', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getByEmploymentType());
  } catch (err) {
    next(err);
  }
});
