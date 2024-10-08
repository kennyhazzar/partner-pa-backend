import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from '../entities';
import { Repository } from 'typeorm';
import { CreatePartnerDto, fullFindOptionsObjectSelect } from '../dto';
import { EntityService } from '@core/services';
import { RequisitesService } from '@resources/summary/requisites/requisites.service';

@Injectable()
export class PartnersService {
  constructor(
    private readonly entityService: EntityService,
    @InjectRepository(Partner)
    private readonly partnersRepository: Repository<Partner>,
    private readonly requisitesService: RequisitesService,
  ) {}

  async create(payload: CreatePartnerDto) {
    const { title } = payload;
    const requisites = payload?.requisites;

    const partner = new Partner();
    partner.title = title;

    if (requisites) {
      partner.requisites = await Promise.all(
        requisites.map(async (requisitesDto) =>
          this.requisitesService.create(requisitesDto),
        ),
      );
    }

    const result = await this.partnersRepository.save(partner);

    return {
      partnerId: result.id,
    };
  }
  async find(take: number, skip: number) {
    return await this.partnersRepository.find({
      relations: {
        accounts: true,
        commissions: true,
        managers: true,
        requisites: true,
        licensedObjects: true,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        accounts: true,
        commissions: true,
        licensedObjects: fullFindOptionsObjectSelect,
        managers: true,
        requisites: true,
      },
      take,
      skip,
    });
  }
  async findOne(id: string) {
    return this.entityService.findOne({
      repository: this.partnersRepository,
      cacheValue: id,
      relations: {
        accounts: true,
        commissions: true,
        managers: true,
        requisites: true,
        licensedObjects: true,
      },
      where: { id },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        accounts: true,
        commissions: true,
        licensedObjects: fullFindOptionsObjectSelect,
        managers: true,
        requisites: true,
      },
    });
  }
}
