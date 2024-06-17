import { Test, TestingModule } from '@nestjs/testing';
import { LicensedObjectService } from './licensed-object.service';

describe('LicensedObjectService', () => {
  let service: LicensedObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LicensedObjectService],
    }).compile();

    service = module.get<LicensedObjectService>(LicensedObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
