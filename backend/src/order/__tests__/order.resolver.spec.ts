import { Test, TestingModule } from '@nestjs/testing';
import { OrderResolver } from '../order.resolver';
import { OrderService } from '../order.service';

describe('OrderResolver', () => {
  let resolver: OrderResolver;
  let orderService: OrderService;

  const order = {
    id: 1,
    orderNumber: 'ORD-123456789-1',
    quantity: 2,
    event: {
      id: 1,
      name: 'Concert',
      date: new Date('2025-04-01T20:00:00'),
      totalTickets: 100,
      availableTickets: 100,
    },
    createdAt: new Date(),
  };

  const mockOrderService = {
    purchaseTickets: jest.fn().mockResolvedValue(order),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderResolver,
        { provide: OrderService, useValue: mockOrderService },
      ],
    }).compile();

    resolver = module.get<OrderResolver>(OrderResolver);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('purchaseTickets mutation', () => {
    it('should return an order when purchaseTickets is called', async () => {
      const result = await resolver.purchaseTickets(1, 2);
      expect(result).toEqual(order);
      expect(orderService.purchaseTickets).toHaveBeenCalledWith(1, 2);
    });
  });
});
