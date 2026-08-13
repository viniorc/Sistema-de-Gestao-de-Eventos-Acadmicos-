import { EventsService } from './events.service';
describe('EventsService', () => { it('lists events ordered by year', async () => { const findMany = jest.fn().mockResolvedValue([]); const service = new EventsService({ event: { findMany } } as never); await service.list(); expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { year: 'desc' } })); }); });
