import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Account,
  Requisites,
  LicensedObject,
  Manager,
  Partner,
  EntityRequisites,
  Bill,
} from '../entities';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import {
  CreateObjectDto,
  FindObjectRawQueryBuilderResponse,
  FindObjectsQuery,
  FindObjectsResponse,
  FindOneObjectQuery,
  fullFindOptionsObjectSelect,
  UpdateObjectDto,
} from '../dto/object.dto';
import { EntityService } from '@core/services';
import { RequisitesService } from '../requisites/requisites.service';
import { getRequisites } from '../requisites/utils';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectRepository(LicensedObject)
    private readonly objectsRepository: Repository<LicensedObject>,
    @InjectRepository(Requisites)
    private readonly requisitesRepository: Repository<Requisites>,
    @InjectRepository(EntityRequisites)
    private entityRequisitesRepository: Repository<EntityRequisites>,
    @InjectRepository(Bill) private readonly billsRepository: Repository<Bill>,
    private readonly entityService: EntityService,
    private readonly requisitesService: RequisitesService,
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
    return await this.entityService.findMany<
      LicensedObject,
      FindObjectsResponse
    >({
      repository: this.objectsRepository,
      cacheValue: `${take}_${skip}`,
      bypassCache: true,
      queryBuilderAlias: 'licensedObject',
      queryBuilder: (qb) => {
        let defaultQb = qb
        .leftJoin('licensedObject.licensedDocuments', 'bill')
        .leftJoin('licensedObject.manager', 'manager')
        .leftJoin('licensedObject.partner', 'partner')
        .leftJoin('licensedObject.account', 'account')
        .leftJoin('licensedObject.requisites', 'requisites')
        .leftJoin('requisites.requisites', 'targetRequisites')
        .select('licensedObject.email', 'licensedObjectEmail')
        .addSelect('licensedObject.id', 'licensedObjectId')
        .addSelect('licensedObject.title', 'licensedObjectTitle')
        .addSelect('licensedObject.phone', 'licensedObjectPhone')
        .addSelect('licensedObject.created_at', 'licensedObjectCreatedAt')
        .addSelect('licensedObject.updated_at', 'licensedObjectUpdatedAt')
        .addSelect('licensedObject.isActive', 'isActive')
        .addSelect('manager.id', 'managerId')
        .addSelect('manager.first_name', 'managerFirstName')
        .addSelect('manager.second_name', 'managerSecondName')
        .addSelect('manager.last_name', 'managerLastName')
        .addSelect('partner.title', 'partnerTitle')
        .addSelect('partner.id', 'partnerId')
        .addSelect('targetRequisites.id', 'reqId')
        .addSelect('account.id', 'accountId')
        .addSelect(
          "AVG(DATE_PART('day', bill.endDate - bill.startDate))",
          'LT',
        )
        .addSelect('AVG(bill.paymentAmount)', 'averageCheck')
        .addSelect('SUM(bill.paymentAmount)', 'LTV')

        if (payload?.managerId) {
          defaultQb = defaultQb.andWhere(`manager.id = :managerId`, {
            managerId: payload.managerId,
          })
        }

        if (payload?.partnerId) {
          defaultQb = defaultQb.andWhere(`partner.id = :partnerId`, {
            partnerId: payload.partnerId,
          })
        }

        if (payload?.accountId) {
          defaultQb = defaultQb.andWhere(`account.id = :accountId`, {
            accountId: payload.accountId,
          })
        }

        console.log(take, skip);

        return defaultQb
          .take(take)
          .skip(skip)
          .groupBy('licensedObject.id')
          .addGroupBy('manager.id')
          .addGroupBy('manager.first_name')
          .addGroupBy('manager.second_name')
          .addGroupBy('manager.last_name')
          .addGroupBy('targetRequisites.id')
          .addGroupBy('partner.id')
          .addGroupBy('partner.title')
          .addGroupBy('account.id')
          .orderBy('licensedObject.created_at', 'DESC')
      },
      transform: async (entities) => {
        const raw =
          entities as unknown as Array<FindObjectRawQueryBuilderResponse>;

        const objectLastBills = await Promise.all(
          raw.map(async (object) => {
            return await this.billsRepository.findOne({
              where: {
                licensedObject: {
                  id: object.licensedObjectId,
                },
              },
              relations: {
                licensedObject: true,
              },
              order: {
                startDate: 'DESC',
              },
            });
          }),
        );

        const objectRequisites = await Promise.all(
          raw.map(async (object) => {
            return {
              requisites: await this.requisitesService.findByEntity({
                objectId: object.licensedObjectId,
              }),
              objectId: object.licensedObjectId,
            };
          }),
        );

        return raw
          .reduce((accumulator, current) => {
            if (
              !accumulator.find(
                (item) => item.licensedObjectId === current.licensedObjectId,
              )
            ) {
              accumulator.push(current);
            }
            return accumulator;
          }, [] as FindObjectRawQueryBuilderResponse[])
          .map((object) => {
            const requisites = objectRequisites.find(
              ({ objectId }) => objectId === object.licensedObjectId,
            ).requisites;

            const lastBill = objectLastBills.find(
              (bill) => bill?.licensedObject?.id === object.licensedObjectId,
            );

            const requisitesObject = getRequisites(requisites);

            return {
              id: object.licensedObjectId,
              title: object.licensedObjectTitle,
              averageBill: +object.averageCheck,
              lt: object.LT,
              ltv: +object.LTV,
              createdAt: object.licensedObjectCreatedAt,
              updatedAt: object.licensedObjectUpdatedAt,
              isSubscribe: !!lastBill,
              subscribeLastDate: lastBill?.startDate,
              subscribeEndDate: lastBill?.endDate,
              inn: {
                inn: requisitesObject?.inn,
                kpp: requisitesObject?.kpp,
                ids: requisitesObject?.ids,
              },
              manager: {
                id: object.managerId,
                firstName: object.managerFirstName,
                secondName: object.managerSecondName,
                lastName: object.managerLastName,
              },
              email: object.licensedObjectEmail,
              partnerTitle: object.partnerTitle,
              partnerId: object.partnerId,
              phone: object.licensedObjectPhone,
              status: object.isActive,
              companyName: requisitesObject?.companyName,
            };
          });
      },
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
