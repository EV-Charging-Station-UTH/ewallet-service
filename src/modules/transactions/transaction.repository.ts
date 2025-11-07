import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateIdempotencyDataType } from './type';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateIdempotencyDataType) {
    
  }

  findUniqueIdempotencyKey(where: Prisma.IdempotencyKeyWhereUniqueInput) {
  }

  update() {}

  delete() {}
}
