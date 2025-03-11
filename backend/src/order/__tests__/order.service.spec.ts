import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../order.entity';
import { EventService } from '../../event/event.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository;
  let eventService;

  const event = {
    id: 1,
    name: 'Concert',
    date: new Date('2025-04-01T20:00:00'),
    totalTickets: 100,
    availableTickets: 100,
  };

  const mockOrderRepository = {
    save: jest
      .fn()
      .mockImplementation((order: Order) =>
        Promise.resolve({ ...order, id: 1 }),
      ),
  };

  const mockEventService = {
    findOne: jest.fn().mockResolvedValue(event),
    decreaseTickets: jest.fn().mockResolvedValue({
      ...event,
      availableTickets: event.availableTickets - 2,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepository },
        { provide: EventService, useValue: mockEventService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(Order));
    eventService = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('purchaseTickets', () => {
    it('should purchase tickets and create an order', async () => {
      const quantity = 2;
      const order = await service.purchaseTickets(1, quantity);
      expect(eventService.findOne).toHaveBeenCalledWith(1);
      expect(eventService.decreaseTickets).toHaveBeenCalledWith(1, quantity);
      expect(orderRepository.save).toHaveBeenCalled();
      expect(order.orderNumber).toMatch(/ORD-\d+-\d+/);
      expect(order.quantity).toEqual(quantity);
      expect(order.event).toEqual(event);
    });

    it('should throw error if event not found', async () => {
      mockEventService.findOne.mockResolvedValueOnce(null);
      await expect(service.purchaseTickets(999, 1)).rejects.toThrow(
        'Event not found',
      );
    });

    it('should throw error if not enough tickets available', async () => {
      mockEventService.findOne.mockResolvedValueOnce({
        ...event,
        availableTickets: 0,
      });
      await expect(service.purchaseTickets(1, 1)).rejects.toThrow(
        'Not enough tickets available',
      );
    });
  });

  describe('generateOrderNumber', () => {
    it('should generate an order number matching the pattern', () => {
      const orderNumber = service.generateOrderNumber();
      expect(orderNumber).toMatch(/ORD-\d+-\d+/);
    });
  });
});
