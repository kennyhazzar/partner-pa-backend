import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Account,
  Requisites,
  LicensedObject,
  Manager,
  Partner,
  EntityRequisites,
} from '../entities';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import {
  CreateObjectDto,
  FindObjectsQuery,
  FindOneObjectQuery,
  fullFindOptionsObjectSelect,
  UpdateObjectDto,
} from '../dto/object.dto';
import { EntityService } from '@core/services';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectRepository(LicensedObject)
    private readonly objectsRepository: Repository<LicensedObject>,
    @InjectRepository(Requisites)
    private readonly requisitesRepository: Repository<Requisites>,
    @InjectRepository(EntityRequisites)
    private entityRequisitesRepository: Repository<EntityRequisites>,
    private readonly entityService: EntityService,
  ) {}

  async create(payload: CreateObjectDto) {
    const { title } = payload;
    const requisites = payload?.requisites;

    const licensedObject = new LicensedObject();
    licensedObject.title = title;
    licensedObject.email = payload?.email;
    licensedObject.phone = payload?.phone;

    if (payload?.partnerId) {
      licensedObject.partner = { id: payload?.partnerId } as Partner;
    }

    if (payload?.managerId) {
      licensedObject.manager = { id: payload?.managerId } as Manager;
    }

    if (payload?.accountId) {
      licensedObject.account = { id: payload?.accountId } as Account;
    }

    if (requisites) {
      licensedObject.requisites = await Promise.all(
        requisites.map(async (requisitesDto) => {
          const requisitesEntity =
            this.requisitesRepository.create(requisitesDto);
          await this.requisitesRepository.save(requisitesEntity);

          const entityRequisites = new EntityRequisites();
          entityRequisites.requisites = requisitesEntity;
          entityRequisites.object = licensedObject;

          return this.entityRequisitesRepository.save(entityRequisites);
        }),
      );
    }

    const result = await this.objectsRepository.save(licensedObject);

    return {
      objectId: result.id,
    };
  }

  async find(payload: FindObjectsQuery, take: number = 10, skip: number = 0) {
    const options: FindManyOptions<LicensedObject> = {
      where: {},
      relations: { requisites: { requisites: true } },
      take,
      skip,
    };

    const { where, relations } = this.getRelationsOptions(payload, options);

    return await this.entityService.findMany({
      repository: this.objectsRepository,
      cacheValue: `${take}_${skip}`,
      where,
      relations,
      take,
      skip,
    });
  }

  async findOne(payload: FindOneObjectQuery) {
    const options: FindManyOptions<LicensedObject> = {
      where: { id: payload.id },
      relations: { requisites: { requisites: true }, manager: true },
    };

    const newOptions = this.getRelationsOptions(payload, options);

    return await this.entityService.findOne<LicensedObject>({
      repository: this.objectsRepository,
      select: fullFindOptionsObjectSelect,
      cacheValue: payload.id,
      relations: newOptions.relations,
      where: newOptions.where,
      ttl: 900,
    });
  }

  async update(id: string, payload: UpdateObjectDto) {
    const object = await this.entityService.findOne<LicensedObject>({
      repository: this.objectsRepository,
      select: fullFindOptionsObjectSelect,
      cacheValue: id,
      relations: {
        requisites: {
          requisites: true,
        },
        account: true,
        manager: true,
        partner: true,
      },
      where: {
        id,
      },
    });

    if (!object) {
      throw new BadRequestException('Объект не найден');
    }

    let newObject: DeepPartial<LicensedObject> = { ...object };

    if (payload?.details) {
      newObject = { ...newObject, ...payload.details };
    }

    if (payload?.requisites) {
      newObject.requisites = payload.requisites;
    }

    if (payload?.accountId) {
      newObject.account = { id: payload?.accountId };
    }

    if (payload?.managerId) {
      newObject.manager = { id: payload?.managerId };
    }

    if (payload?.partnerId) {
      newObject.partner = { id: payload?.partnerId };
    }

    if (payload?.accountId) {
      newObject.account = { id: payload?.accountId };
    }

    return await this.objectsRepository.save(newObject);
  }

  async delete(id: string) {
    return this.objectsRepository.delete(id);
  }

  private getRelationsOptions(
    payload: FindObjectsQuery | FindOneObjectQuery,
    options: FindManyOptions<LicensedObject>,
  ) {
    const newOptions: FindManyOptions<LicensedObject> = { ...options };

    if (payload?.accountId) {
      newOptions.where = {
        ...newOptions.where,
        account: { id: payload.accountId },
      };
      newOptions.relations = { ...newOptions.relations, account: true };
    }

    if (payload?.managerId) {
      newOptions.where = {
        ...newOptions.where,
        manager: { id: payload.managerId },
      };
      newOptions.relations = { ...newOptions.relations, manager: true };
    }

    if (payload?.partnerId) {
      newOptions.where = {
        ...newOptions.where,
        partner: { id: payload.partnerId },
      };
      newOptions.relations = { ...newOptions.relations, partner: true };
    }

    return newOptions;
  }
}
