import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRequisites, Requisites } from '../entities';
import { FindManyOptions, Repository } from 'typeorm';
import {
  CreateRequisitesDto,
  UpdateEntityRequisitesDto,
  UpdateRequisitesDto,
} from '../dto';

@Injectable()
export class RequisitesService {
  constructor(
    @InjectRepository(Requisites)
    private readonly requisitesRepository: Repository<Requisites>,
    @InjectRepository(EntityRequisites)
    private readonly entityRequisitesRepository: Repository<EntityRequisites>,
  ) {}

  async findOneByRequisiteId(id: string) {
    return this.entityRequisitesRepository.findOne({
      where: {
        requisites: {
          id,
        }
      }
    });
  }

  async findByEntity(payload: UpdateEntityRequisitesDto) {
    const options: FindManyOptions<EntityRequisites> = {
      where: {},
      relations: { requisites: true },
    };

    if (payload?.accountId) {
      options.where = { ...options.where, account: { id: payload.accountId } };
      options.relations = { ...options.relations, account: true }
    } else if (payload?.objectId) {
      options.where = { ...options.where, object: { id: payload.objectId } };
      options.relations = { ...options.relations, object: true }
    } else if (payload?.requisitesId) {
      options.where = { ...options.where, requisites: { id: payload.requisitesId } };
    } else if (payload?.partnerId) {
      options.where = { ...options.where, partner: { id: payload.partnerId } };
      options.relations = { ...options.relations, partner: true }
    }

    return this.entityRequisitesRepository.find(options);
  }

  async create(payload: CreateRequisitesDto) {
    const requisitesEntity = this.requisitesRepository.create(payload);
    await this.requisitesRepository.save(requisitesEntity);

    const entityRequisites = new EntityRequisites();
    entityRequisites.requisites = requisitesEntity;

    return this.entityRequisitesRepository.save(entityRequisites);
  }

  async update(payload: UpdateRequisitesDto) {
    // const requisite = await this.entityRequisitesRepository
  }

  async updateEntity(payload: UpdateEntityRequisitesDto) {}

  async delete(id: string) {
    const requisite = await this.entityRequisitesRepository.findOne({
      where: {
        requisites: {
          id,
        },
      },
      relations: {
        requisites: true,
      },
    });

    if (!requisite) {
      throw new BadRequestException('Реквизиты не найдены');
    }

    await this.requisitesRepository.delete(id);
    await this.entityRequisitesRepository.delete(requisite.id);
  }
}
