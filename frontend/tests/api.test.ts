import { employeesApi, analyticsApi } from '../lib/api';

describe('api', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('employeesApi', () => {
    it('list() constructs the correct URL with params', async () => {
      const mockResponse = { data: [], meta: {} };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await employeesApi.list({ page: 2, search: 'John', status: 'Active' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/employees?page=2&search=John&status=Active'),
        expect.any(Object)
      );
    });

    it('throws error if response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Validation failed' }),
      });

      await expect(employeesApi.list({})).rejects.toThrow('Validation failed');
    });

    it('exportUrl() correctly formats the query string', () => {
      const url = employeesApi.exportUrl({ search: 'John', status: 'Active' });
      expect(url).toContain('/api/employees/export?search=John&status=Active');
    });
  });

  describe('analyticsApi', () => {
    it('summary() fetches correctly', async () => {
      const mockResponse = { totalEmployees: 100 };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const res = await analyticsApi.summary();
      expect(res).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/analytics/summary'),
        expect.any(Object)
      );
    });
  });
});
