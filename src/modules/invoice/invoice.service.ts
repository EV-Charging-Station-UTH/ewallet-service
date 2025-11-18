import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { InvoiceRepository } from 'src/common/repositories/invoice.repository';
import { CreateInvoiceType, UpdateInvoiceType } from 'src/common/types/invoice';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepo: InvoiceRepository) {}

  createInvoice(data: CreateInvoiceType) {
    return this.invoiceRepo.create(data);
  }

  async listInvoices(params: {
    page: number;
    limit: number;
    sessionId?: number;
    userId?: string;
    walletId?: string;
    status?: InvoiceStatus;
  }) {
    return this.invoiceRepo.findManyInvoices(params);
  }

  async getInvoice({
    id,
    transactionId,
  }: {
    id?: string;
    transactionId?: string;
  }) {
    const invoice = await this.invoiceRepo.findUnique({ id, transactionId });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async updateInvoice(data: Partial<UpdateInvoiceType> & { id: string }) {
    const invoice = await this.invoiceRepo.update(data);
    return invoice;
  }

  async deleteInvoice(id: string) {
    await this.invoiceRepo.delete(id);
    return { message: 'Invoice deleted successfully' };
  }
}
