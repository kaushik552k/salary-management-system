import { Router, Request, Response, NextFunction } from 'express';
import {
  getSummary,
  getByDepartment,
  getByCountry,
  getByLevel,
  getDistribution,
  getByEmploymentType,
  getPayrollTrend,
  getPayrollComponents,
  getComplianceStatus,
  getRecentPayRuns,
  getPayRunSummary,
} from '../services/analytics.service';

export const analyticsRouter = Router();

const wrap = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await fn()); } catch (err) { next(err); }
};

analyticsRouter.get('/summary', wrap(getSummary));
analyticsRouter.get('/by-department', wrap(getByDepartment));
analyticsRouter.get('/by-country', wrap(getByCountry));
analyticsRouter.get('/by-level', wrap(getByLevel));
analyticsRouter.get('/distribution', wrap(getDistribution));
analyticsRouter.get('/by-employment-type', wrap(getByEmploymentType));
analyticsRouter.get('/payroll-trend', wrap(getPayrollTrend));
analyticsRouter.get('/payroll-components', wrap(getPayrollComponents));
analyticsRouter.get('/compliance', wrap(getComplianceStatus));
analyticsRouter.get('/recent-pay-runs', wrap(getRecentPayRuns));
analyticsRouter.get('/pay-runs/summary', wrap(getPayRunSummary));
