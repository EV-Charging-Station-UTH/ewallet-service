import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type ManualBodyType = {
  sessionId: string;
  amount: number;
};
@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkout(sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('sessionId is required');
    }

    // Gọi charging-service để kiểm tra và lấy ra amount
    const amount = 100000; // data ex

    // Giả sử session hợp lệ -> tạo invoice
    const invoice = await this.prismaService.invoice.create({
      data: {
        userId: session.userId,
        amount: session.amount,
        status: 'PAID',
        paymentMethod: 'CHECKOUT',
        sessionId,
      },
    });

    // Cập nhật trạng thái session
    await this.prismaService.paymentSession.update({
      where: { sessionId },
      data: { status: 'COMPLETED' },
    });

    return {
      message: 'Checkout success',
      invoice,
    };
  }

  /**
   * Manual payment (chuyển khoản, momo, nạp thẻ…)
   */
  async manual(data: ManualBodyType) {
    const { amount, sessionId } = data;
    if (!sessionId) {
      throw new BadRequestException('sessionId is required');
    }

    if (amount < 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const session = await this.prismaService.paymentSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      throw new NotFoundException('Manual session not found');
    }

    const invoice = await this.prismaService.invoice.create({
      data: {
        userId: session.userId,
        amount: session.amount,
        status: 'PENDING', // Manual thì chờ duyệt
        paymentMethod: 'MANUAL',
        sessionId,
      },
    });

    await this.prismaService.paymentSession.update({
      where: { sessionId },
      data: { status: 'WAITING_CONFIRM' },
    });

    return {
      message: 'Manual payment created – waiting for admin approval',
      invoice,
    };
  }

  /**
   * Lấy danh sách invoice theo user
   */
  async listInvoicesForUser(userId: number) {
    if (!userId) return [];

    return this.prismaService.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
