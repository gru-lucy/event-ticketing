import { Test, TestingModule } from '@nestjs/testing';
import { EventResolver } from '../event.resolver';
import { EventService } from '../event.service';

describe('EventResolver', () => {
  let resolver: EventResolver;
  let eventService: EventService;

  const events = [
    {
      id: 1,
      name: 'Concert',
      date: new Date('2025-04-01T20:00:00'),
      totalTickets: 100,
      availableTickets: 100,
    },
  ];

  const mockEventService = {
    findAll: jest.fn().mockResolvedValue(events),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventResolver,
        { provide: EventService, useValue: mockEventService },
      ],
    }).compile();

    resolver = module.get<EventResolver>(EventResolver);
    eventService = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('events query', () => {
    it('should return an array of events', async () => {
      const result = await resolver.events();
      expect(result).toEqual(events);
      expect(eventService.findAll).toHaveBeenCalled();
    });
  });
});
