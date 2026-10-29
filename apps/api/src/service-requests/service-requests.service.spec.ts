import { ServiceRequestsService } from './service-requests.service';
import { RequestStatus, ServiceType, ShiftCoverage } from '@prisma/client';

describe('ServiceRequestsService', () => {
  let service: ServiceRequestsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      serviceRequest: {
        count: jest.fn().mockResolvedValue(12),
        create: jest.fn().mockImplementation((args) =>
          Promise.resolve({ id: 'sr-1', ...args.data }),
        ),
        findUnique: jest.fn(),
      },
      client: {
        findUnique: jest.fn().mockResolvedValue(null),
      },
    };
    service = new ServiceRequestsService(mockPrisma);
  });

  it('should generate reference number SR-2026-00013 and create request', async () => {
    const dto = {
      contactName: 'Test Contact',
      phone: '+251911000000',
      serviceType: ServiceType.STATIC_GUARDING,
      siteAddress: 'Test Site',
      city: 'Addis Ababa',
      guardCount: 2,
      shiftCoverage: ShiftCoverage.DAY,
    };

    const res = await service.create(dto);
    expect(res.referenceNumber).toMatch(/^SR-\d{4}-00013$/);
    expect(res.status).toBe(RequestStatus.NEW);
  });
});
