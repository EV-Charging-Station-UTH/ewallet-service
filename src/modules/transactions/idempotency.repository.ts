import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateIdempotencyDataType } from './type';

type UpdateIdempotencyDataType = Partial<Omit<CreateIdempotencyDataType, 'idempotencyKey'>> & {
  idempotencyKey: string;
};


@Injectable()
export class IdempotencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateIdempotencyDataType) {
    return this.prisma.idempotencyKey.create({
      data,
    });
  }

  findUniqueIdempotencyKey(where: Prisma.IdempotencyKeyWhereUniqueInput) {
    return this.prisma.idempotencyKey.findUnique({ where });
  }

  update(data: UpdateIdempotencyDataType) {
    const { idempotencyKey, ...restData } = data;
    return this.prisma.idempotencyKey.update({
      where: {
        idempotencyKey,
      },
      data: {
        ...restData,
      },
    });
  }

  delete() {}
}
