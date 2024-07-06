import { EntityService } from '@core/services';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Account,
  EntityRequisites,
  Manager,
  Partner,
  Requisites,
} from '../entities';
import { FindManyOptions, Repository } from 'typeorm';
import {
  CreateAccountDto,
  FindAccountQuery,
  FindAccountsQuery,
  FindAccountsResponse,
} from '../dto';

@Injectable()
export class AccountsService {
  constructor(
    private readonly entityService: EntityService,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(Requisites)
    private readonly requisitesRepository: Repository<Requisites>,
    @InjectRepository(EntityRequisites)
    private entityRequisitesRepository: Repository<EntityRequisites>,
  ) {}

  async create(payload: CreateAccountDto) {
    const { requisites } = payload;

    const account = new Account();

    account.email = payload?.email;
    account.phone = payload?.phone;

    if (payload?.partnerId) {
      account.partner = { id: payload?.partnerId } as Partner;
    }

    if (payload?.managerId) {
      account.manager = { id: payload?.managerId } as Manager;
    }

    if (requisites) {
      account.requisites = await Promise.all(
        requisites.map(async (requisitesDto) => {
          const requisitesEntity =
            this.requisitesRepository.create(requisitesDto);
          await this.requisitesRepository.save(requisitesEntity);

          const entityRequisites = new EntityRequisites();
          entityRequisites.requisites = requisitesEntity;
          entityRequisites.account = account;

          return this.entityRequisitesRepository.save(entityRequisites);
        }),
      );
    }
  }
  async find(
    payload: FindAccountsQuery,
    take: number = 10,
    skip: number = 0,
  ): Promise<Array<FindAccountsResponse>> {
    const { where, relations }: FindManyOptions<Account> =
      this.getRelationsOptions(payload, {
        where: {},
        relations: { requisites: { requisites: true } },
        take,
        skip,
      });

    return await this.entityService.findMany<Account, FindAccountsResponse>({
      repository: this.accountsRepository,
      cacheValue: `${take}_${skip}`,
      where,
      relations,
      take,
      skip,
      ttl: 900,
      transform: (accounts) => {
        return accounts.map((account) => {
          const activeObjectsCount = account.licensedObjects.filter(
            (object) => object.isActive,
          );

          const objectsCount = account.licensedObjects.length;

          const { inn, companyName } = account.requisites.reduce(
            (acc, curr, index) => {
              return {
                inn:
                  acc.inn + `${curr.requisites.inn}${index !== 0 ? ', ' : ''}`,
                companyName:
                  acc.companyName +
                  `${curr.requisites.companyName}${index !== 0 ? ', ' : ''}`,
              };
            },
            { inn: '', companyName: '' },
          );

          return {
            inn,
            companyName,
            averageBill: 0,
            ltv: 0,
            revenue: 0,
            email: account.email,
            phone: account.phone,
            manager: account.manager ? {
              id: account.manager.id,
              fullName: account.manager.fullName || `${account.manager.firstName} ${account.manager.secondName} ${account.manager.lastName}`,
              createdAt: account.manager.createdAt,
              updatedAt: account.manager.updatedAt,
            } : null,
            objectsRatio: `${activeObjectsCount} / ${objectsCount}`,
            partner: account.partner ? {
              id: account.partner.id,
              title: account.partner.id,
              requisites: account.partner.requisites,
            } : null,
          };
        });
      },
    });
  }

  async findOne(payload: FindAccountQuery) {
    const { where, relations } = this.getRelationsOptions(payload, {
      where: { id: payload.id },
      relations: { requisites: { requisites: true } },
    });

    return await this.entityService.findOne<Account>({
      repository: this.accountsRepository,
      cacheValue: payload.id,
      relations,
      where,
    });
  }

  private getRelationsOptions(
    payload: FindAccountsQuery | FindAccountQuery,
    options: FindManyOptions<Account>,
  ) {
    const newOptions: FindManyOptions<Account> = { ...options };

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
