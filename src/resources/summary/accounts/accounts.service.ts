import { EntityService } from '@core/services';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account, Manager, Partner } from '../entities';
import { FindManyOptions, Repository } from 'typeorm';
import {
  CreateAccountDto,
  FindAccountQuery,
  FindAccountsQuery,
  FindAccountsRawQueryBuilderResponse,
  FindAccountsResponse,
  UpdateSoftwareAccountDto,
} from '../dto';
import { RequisitesService } from '@resources/summary/requisites/requisites.service';
import { ProductsService } from '../products/products.service';
import { getRequisites } from '../requisites/utils';

@Injectable()
export class AccountsService {
  constructor(
    private readonly requisitesService: RequisitesService,
    private readonly productsService: ProductsService,
    private readonly entityService: EntityService,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async create(payload: CreateAccountDto) {
    const { requisites } = payload;

    const account = new Account();

    account.email = payload?.email;
    account.phone = payload?.phone;
    account.franchise = payload?.franchise;

    if (payload?.partnerId) {
      account.partner = { id: payload?.partnerId } as Partner;
    }

    if (payload?.managerId) {
      account.manager = { id: payload?.managerId } as Manager;
    }

    if (requisites) {
      account.requisites = await Promise.all(
        requisites.map(async (requisitesDto) =>
          this.requisitesService.create(requisitesDto),
        ),
      );
    }

    return this.accountsRepository.save(account);
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
      cacheValue: `accounts_${take}_${skip}`,
      where,
      relations,
      take,
      skip,
      ttl: 300,
      bypassCache: true,
      queryBuilderAlias: 'account',
      queryBuilder: (qb) => {
        return qb
          .leftJoin('account.licensedObjects', 'licensedObject')
          .leftJoin('account.requisites', 'accountRequisites')
          .leftJoin('accountRequisites.requisites', 'targetRequisites')
          .leftJoin('account.manager', 'manager')
          .leftJoin('account.partner', 'partner')
          .leftJoin('licensedObject.licensedDocuments', 'bill')
          .select('account.id', 'accountId')
          .addSelect('account.email', 'accountEmail')
          .addSelect('account.phone', 'accountPhone')
          .addSelect('account.created_at', 'accountCreatedAt')
          .addSelect('account.updated_at', 'accountUpdatedAt')
          .addSelect('manager.id', 'managerId')
          .addSelect('manager.first_name', 'managerFirstName')
          .addSelect('manager.second_name', 'managerSecondName')
          .addSelect('manager.last_name', 'managerLastName')
          .addSelect('targetRequisites.id', 'reqId')
          .addSelect('partner.title', 'partnerTitle')
          .addSelect(
            'COUNT(DISTINCT licensedObject.id)',
            'totalLicensedObjects',
          )
          .addSelect(
            `
            COUNT(DISTINCT licensedObject.id)
            FILTER (WHERE licensedObject.isActive = true 
            OR (bill.invoiceStatus = 'paid' AND bill.startDate <= NOW() AND bill.endDate >= NOW()))
        `,
            'activeLicensedObjects',
          )
          .addSelect(
            "AVG(DATE_PART('day', bill.endDate - bill.startDate))",
            'LT',
          )
          .addSelect('AVG(bill.paymentAmount)', 'averageCheck')
          .addSelect('SUM(bill.paymentAmount)', 'LTV')
          .groupBy('account.id')
          .addGroupBy('manager.first_name')
          .addGroupBy('manager.second_name')
          .addGroupBy('manager.last_name')
          .addGroupBy('manager.id')
          .addGroupBy('targetRequisites.id')
          .addGroupBy('partner.title');
      },
      transform: async (entities) => {
        const raw =
          entities as unknown as Array<FindAccountsRawQueryBuilderResponse>;

        const accountRequisites = await Promise.all(
          raw.map(async (account) => {
            return {
              requisites: await this.requisitesService.findByEntity({
                accountId: account.accountId,
              }),
              accountId: account.accountId,
            };
          }),
        );

        return raw
          .reduce((accumulator, current) => {
            if (
              !accumulator.find((item) => item.accountId === current.accountId)
            ) {
              accumulator.push(current);
            }
            return accumulator;
          }, [] as FindAccountsRawQueryBuilderResponse[])
          .map((account) => {
            const requisites = accountRequisites.find(
              ({ accountId }) => accountId === account.accountId,
            ).requisites;

            const requisitesObject = getRequisites(requisites);

            return {
              id: account.accountId,
              email: account.accountEmail,
              inn: {
                ids: requisitesObject?.ids,
                kpp: requisitesObject?.kpp,
                inn: requisitesObject?.inn,
              },
              lt: account.LT,
              ltv: +account.LTV,
              companyName: requisitesObject?.companyName,
              averageBill: +account.averageCheck,
              partner: account.partnerTitle,
              objectsRatio: `${account.activeLicensedObjects} / ${account.totalLicensedObjects}`,
              manager: {
                firstName: account.managerFirstName,
                secondName: account.managerSecondName,
                lastName: account.managerLastName,
              },
              phone: account.accountPhone,
            };
          });
      },
    });
  }

  async findOne(payload: FindAccountQuery) {
    const { where, relations } = this.getRelationsOptions(payload, {
      where: { id: payload.id },
      relations: { requisites: { requisites: true }, software: true },
    });

    const account = await this.entityService.findOne<Account>({
      repository: this.accountsRepository,
      cacheValue: payload.id,
      relations,
      where,
    });

    if (!account) {
      throw new NotFoundException();
    }

    return account;
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

  async updateSoftware(id: string, { softwareId }: UpdateSoftwareAccountDto) {
    const software = await this.productsService.findOne(softwareId);

    if (!software) {
      throw new BadRequestException('Такого ПО не существует');
    }

    const account = await this.findOne({
      id,
    });

    if (!account) {
      throw new BadRequestException('Такого аккаунта не существует');
    }

    return await this.accountsRepository.save({
      ...account,
      software: { id: softwareId },
    });
  }
}
