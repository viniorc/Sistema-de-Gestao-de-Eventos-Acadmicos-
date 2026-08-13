import { HealthController } from './health.controller';
describe('HealthController', () => { it('returns status and timestamp', () => { const result = new HealthController().check(); expect(result.status).toBe('ok'); expect(new Date(result.timestamp).getTime()).not.toBeNaN(); }); });
