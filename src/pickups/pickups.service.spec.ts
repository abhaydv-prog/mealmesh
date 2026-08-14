import { Test, TestingModule } from '@nestjs/testing';
import { PickupsService } from './pickups.service';

describe('PickupsService', () => {
  let service: PickupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PickupsService],
    }).compile();

    service = module.get<PickupsService>(PickupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
