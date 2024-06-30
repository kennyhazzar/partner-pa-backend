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
  UpdateObjectDto,
} from '../dto/object.dto';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectRepository(LicensedObject)
    private readonly objectsRepository: Repository<LicensedObject>,
    @InjectRepository(Requisites)
    private readonly requisitesRepository: Repository<Requisites>,
    @InjectRepository(EntityRequisites)
    private entityRequisitesRepository: Repository<EntityRequisites>,
  ) {}

  async create(payload: CreateObjectDto) {
    const { requisites, title } = payload;

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

    await this.objectsRepository.save(licensedObject);

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

    return this.objectsRepository.save(licensedObject);
  }

  async find(payload: FindObjectsQuery, take: number = 10, skip: number = 0) {
    const options: FindManyOptions<LicensedObject> = {
      where: {},
      relations: { requisites: { requisites: true } },
      take,
      skip,
    };

    return await this.objectsRepository.find(
      this.getRelationsOptions(payload, options),
    );
  }

  async findOne(payload: FindOneObjectQuery) {
    const options: FindManyOptions<LicensedObject> = {
      where: { id: payload.id },
      relations: { requisites: { requisites: true } },
    };

    return await this.objectsRepository.findOne(
      this.getRelationsOptions(payload, options),
    );
  }

  async update(id: string, payload: UpdateObjectDto) {
    const object = await this.objectsRepository.findOne({ where: { id } });

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
    const newOptions = { ...options };

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
        account: { id: payload.managerId },
      };
      newOptions.relations = { ...newOptions.relations, manager: true };
    }

    if (payload?.partnerId) {
      newOptions.where = {
        ...newOptions.where,
        account: { id: payload.partnerId },
      };
      newOptions.relations = { ...newOptions.relations, partner: true };
    }

    return newOptions;
  }
}
