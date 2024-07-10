import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Software } from '../entities/software.entity';
import { Repository } from 'typeorm';
import {
  CreateSoftwareDto,
  FindSoftwareRawQueryBuilderResponse,
  FindSoftwareResponse,
} from '../dto';
import { EntityService } from '@core/services';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
    private readonly entitiesService: EntityService,
  ) {}

  async create(payload: CreateSoftwareDto) {
    return this.softwareRepository.save(payload);
  }

  async findOne(id: string) {
    return this.softwareRepository.findOne({
      where: {
        id,
      },
    });
  }

  async find() {
    return this.entitiesService.findMany<Software, FindSoftwareResponse>({
      repository: this.softwareRepository,
      cacheValue: `products`,
      bypassCache: true,
      queryBuilderAlias: 'software',
      queryBuilder: (qb) => {
        return qb
          .leftJoin('software.accounts', 'account')
          .leftJoin('account.licensedObjects', 'licensedObject')
          .leftJoin('licensedObject.licensedDocuments', 'bill')
          .select('software.title', 'softwareName')
          .addSelect('software.owner', 'softwareOwner')
          .addSelect('COUNT(DISTINCT account.id)', 'totalAccounts')
          .addSelect(
            `
            COUNT(DISTINCT account.id) 
            FILTER (WHERE account.isActive = true 
            OR (bill.invoiceStatus = 'paid' AND bill.startDate <= NOW() AND bill.endDate >= NOW()))
          `,
            'activeAccounts',
          )
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
            `
            AVG(
                CASE
                    WHEN bill.invoiceStatus = 'paid'
                    THEN DATE_PART('day', bill.endDate - bill.startDate)
                    ELSE NULL
                END
            )
        `,
            'LT',
          )
          .addSelect(
            `
          AVG(
              CASE
                  WHEN bill.invoiceStatus = 'paid'
                  THEN bill.payment_amount
                  ELSE NULL
              END
          )
      `,
            'averageCheck',
          )
          .addSelect(
            `
        SUM(
            CASE
                WHEN bill.invoiceStatus = 'paid'
                THEN bill.payment_amount
                ELSE NULL
            END
        )
    `,
            'LTV',
          )
          .groupBy('software.id')
          .addGroupBy('software.title')
          .addGroupBy('software.owner');
      },
      transform: async (entities) => {
        console.log(entities);

        const raw =
          entities as unknown as Array<FindSoftwareRawQueryBuilderResponse>;

        return raw.map(
          ({
            totalLicensedObjects,
            totalAccounts,
            LT,
            LTV,
            activeAccounts,
            activeLicensedObjects,
            averageCheck,
            softwareName,
            softwareOwner,
          }) => ({
            title: softwareName,
            owner: softwareOwner,
            accountsRatio: `${activeAccounts} / ${totalAccounts}`,
            averageBill: +averageCheck,
            lt: LT,
            ltv: +LTV,
            objectsRatio: `${activeLicensedObjects} / ${totalLicensedObjects}`,
          }),
        );
      },
    });
  }
}
