import { Test, TestingModule } from '@nestjs/testing';
import { LicensedObjectController } from './licensed-object.controller';
import { LicensedObjectService } from './licensed-object.service';

describe('LicensedObjectController', () => {
  let controller: LicensedObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LicensedObjectController],
      providers: [LicensedObjectService],
    }).compile();

    controller = module.get<LicensedObjectController>(LicensedObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
