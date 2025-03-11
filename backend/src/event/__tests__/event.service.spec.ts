import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../event.service';
import { Event } from '../event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('EventService', () => {
  let service: EventService;
  let repository: Repository<Event>;

  const eventArray = [
    {
      id: 1,
      name: 'Concert',
      date: new Date('2025-04-01T20:00:00'),
      totalTickets: 100,
      availableTickets: 100,
    },
    {
      id: 2,
      name: 'Play',
      date: new Date('2025-05-15T19:00:00'),
      totalTickets: 50,
      availableTickets: 50,
    },
  ];

  const mockRepository = {
    find: jest.fn().mockResolvedValue(eventArray),
    findOneBy: jest
      .fn()
      .mockImplementation(({ id }) =>
        Promise.resolve(eventArray.find((e) => e.id === id)),
      ),
    create: jest.fn().mockImplementation((data: Event) => data),
    save: jest
      .fn()
      .mockImplementation((event: Event) =>
        Promise.resolve({ ...event, id: event.id || 1 }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const events = await service.findAll();
      expect(events).toEqual(eventArray);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const event = await service.findOne(1);
      expect(event).toEqual(eventArray[0]);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return undefined if event not found', async () => {
      const event = await service.findOne(999);
      expect(event).toBeUndefined();
    });
  });

  describe('createEvent', () => {
    it('should create and save an event', async () => {
      const eventData = {
        name: 'New Event',
        date: new Date(),
        totalTickets: 200,
        availableTickets: 200,
      };
      const newEvent = await service.createEvent(eventData);
      expect(repository.create).toHaveBeenCalledWith(eventData);
      expect(repository.save).toHaveBeenCalledWith(eventData);
      expect(newEvent).toEqual({ ...eventData, id: expect.any(Number) });
    });
  });

  describe('decreaseTickets', () => {
    it('should decrease availableTickets if sufficient tickets are available', async () => {
      const quantity = 10;
      const event = { ...eventArray[0] };

      mockRepository.findOneBy.mockResolvedValueOnce(event);
      const updatedEvent = await service.decreaseTickets(1, quantity);
      expect(updatedEvent.availableTickets).toEqual(
        eventArray[0].availableTickets - quantity,
      );
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw an error if event not found', async () => {
      mockRepository.findOneBy.mockResolvedValueOnce(undefined);
      await expect(service.decreaseTickets(999, 1)).rejects.toThrow(
        'Event not found',
      );
    });

    it('should throw an error if not enough tickets available', async () => {
      const event = { ...eventArray[0], availableTickets: 5 };
      mockRepository.findOneBy.mockResolvedValueOnce(event);
      await expect(service.decreaseTickets(1, 10)).rejects.toThrow(
        'Not enough tickets available',
      );
    });
  });
});
