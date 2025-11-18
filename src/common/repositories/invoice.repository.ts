import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { CreateInvoiceType, UpdateInvoiceType } from '../types/invoice';

@Injectable()
export class InvoiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateInvoiceType) {
    return this.prisma.invoice.create({
      data,
    });
  }

  async findManyInvoices({
    page,
    limit,
    sessionId,
    userId,
    walletId,
    status,
  }: {
    page: number;
    limit: number;
    sessionId?: number;
    userId?: string;
    walletId?: string;
    status?: InvoiceStatus;
  }): Promise<{
    data: any[];
    totalItem: number;
    page: number;
    limit: number;
    totalPage: number;
  }> {
    const skip = (page - 1) * limit;
    const take = limit;

    // Build dynamic where
    const where: any = {};
    if (sessionId !== undefined) where.sessionId = sessionId;
    if (userId) where.userId = userId;
    if (walletId) where.walletId = walletId;
    if (status) where.status = status;

    const [invoiceItems, totalItem] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' }, // tuỳ chọn sort mới nhất
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: invoiceItems,
      totalItem,
      page,
      limit,
      totalPage: Math.ceil(totalItem / limit),
    };
  }

  findUnique({ id, transactionId }: { id?: string; transactionId?: string }) {
    if (id) {
      return this.prisma.invoice.findUnique({
        where: { id },
      });
    }

    if (transactionId) {
      return this.prisma.invoice.findUnique({
        where: { transactionId },
      });
    }

    return null;
  }

  update(data: Partial<UpdateInvoiceType> & { id: string }) {
    const { id, ...restData } = data;
    if (!id) throw new Error('Invoice id is required');

    return this.prisma.invoice.update({
      where: { id },
      data: restData as Prisma.InvoiceUncheckedUpdateInput,
    });
  }

  delete(id: string) {
    return this.prisma.invoice.delete({
      where: {
        id,
      },
    });
  }
}
