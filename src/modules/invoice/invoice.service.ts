import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { InvoiceRepository } from 'src/common/repositories/invoice.repository';
import { CreateInvoiceType, UpdateInvoiceType } from 'src/common/types/invoice';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  createInvoice(data: CreateInvoiceType) {
    return this.invoiceRepository.create(data);
  }

  listInvoices(params: {
    page: number;
    limit: number;
    sessionId?: number;
    userId?: string;
    walletId?: string;
    status?: InvoiceStatus;
  }) {
    return this.invoiceRepository.findManyInvoices(params);
  }

  async getInvoice({
    id,
    transactionId,
  }: {
    id?: string;
    transactionId?: string;
  }) {
    const invoice = await this.invoiceRepository.findUnique({
      id,
      transactionId,
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async updateInvoice(data: Partial<UpdateInvoiceType> & { id: string }) {
    const invoice = await this.invoiceRepository.update(data);
    return invoice;
  }

  async deleteInvoice(id: string) {
    await this.invoiceRepository.delete(id);
    return { message: 'Invoice deleted successfully' };
  }
}
