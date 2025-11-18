import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceStatus } from '@prisma/client';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from 'src/common/dtos/invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() body: CreateInvoiceDto) {
    return this.invoiceService.createInvoice({
      ...body,
      amountBigint: BigInt(body.amountBigint),
    });
  }

  @Get()
  list(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sessionId') sessionId?: number,
    @Query('userId') userId?: string,
    @Query('walletId') walletId?: string,
    @Query('status') status?: InvoiceStatus,
  ) {
    return this.invoiceService.listInvoices({
      page,
      limit,
      sessionId,
      userId,
      walletId,
      status,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.invoiceService.getInvoice({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<UpdateInvoiceDto>) {
    return this.invoiceService.updateInvoice({ id, ...body });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.invoiceService.deleteInvoice(id);
  }
}
