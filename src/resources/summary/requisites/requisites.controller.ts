import { Controller } from '@nestjs/common';
import { RequisitesService } from './requisites.service';

@Controller('requisites')
export class RequisitesController {
  constructor(private readonly requisitesService: RequisitesService) {}
}
