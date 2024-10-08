import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBillWithRelationsDto } from '../dto/bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from '../entities';
import { Repository } from 'typeorm';
import { getRequisites } from '../requisites/utils';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill) private readonly billsRepository: Repository<Bill>,
  ) {}

  async create(payload: CreateBillWithRelationsDto) {
    const bill = payload.bill;

    let newBill = await this.billsRepository.save(bill);

    if (payload?.licensedObjectId) {
      newBill = await this.billsRepository.save({
        ...newBill,
        licensedObject: { id: payload.licensedObjectId },
      });
    }

    if (payload?.managerId) {
      newBill = await this.billsRepository.save({
        ...newBill,
        licensedObject: { id: payload.licensedObjectId },
      });
    }

    return newBill;
  }

  async find(take: number = 10, skip: number = 0) {
    const bills = await this.billsRepository.find({
      where: {},
      relations: {
        licensedObject: {
          requisites: {
            requisites: true,
          },
        },
        manager: true,
      },
    });

    if (!bills.length) {
      return [];
    }

    return bills.map((bill) => {
      const requisites = getRequisites(bill?.licensedObject?.requisites);

      return {
        title: bill?.documentName,
        inn: {
          inn: requisites?.inn,
          ids: requisites?.ids,
          kpp: requisites?.kpp,
          companyName: requisites?.companyName,
        },
        email: bill?.licensedObject?.email,
        phone: bill?.licensedObject?.phone,
        createdAt: bill.createdAt,
        accountNumber: bill.accountNumber,
        invoiceAmount: bill.invoiceAmount,
        paymentAmount: bill.paymentAmount,
        invoiceStatus: bill.invoiceStatus,
        startDate: bill.startDate,
        endDate: bill.endDate,
        manager: {
          firstName: bill.manager?.firstName,
          secondName: bill.manager?.secondName,
          lastName: bill.manager?.lastName,
        },
      };
    });
  }
}
