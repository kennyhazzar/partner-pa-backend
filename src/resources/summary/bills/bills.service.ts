import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBillWithRelationsDto } from '../dto/bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from '../entities';
import { Repository } from 'typeorm';

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

  find() {}

  findOne() {}
}
