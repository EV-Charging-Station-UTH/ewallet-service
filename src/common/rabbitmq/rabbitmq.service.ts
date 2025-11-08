import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import {
  connect,
  ChannelWrapper,
  AmqpConnectionManager,
} from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

export interface ExchangeConfig {
  name: string;
  type?: 'direct' | 'topic' | 'headers' | 'fanout' | 'match';
  durable?: boolean;
  queue?: string;
  routingKey?: string;
}

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private readonly logger = new Logger(RabbitmqService.name);

  onModuleInit() {
    this.connection = connect([
      process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
    ]);

    this.connection.on('connect', () =>
      this.logger.log('Connected to RabbitMQ'),
    );
    this.connection.on('disconnect', (err) =>
      this.logger.error('Disconnected from RabbitMQ', err),
    );

    this.channel = this.connection.createChannel({
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange('topup_exchange', 'topic', {
          durable: true,
        });
        await channel.assertQueue('topup_queue', { durable: true });
        await channel.bindQueue(
          'topup_queue',
          'topup_exchange',
          'topup.webhook',
        );
      },
    });
  }

  async onModuleDestroy() {
    await this.connection.close();
  }

  async publish(
    exchange: string,
    routingKey: string,
    message: any,
    exchangeType: 'direct' | 'topic' | 'fanout' | 'headers' = 'topic',
    durable?: true,
  ) {
    await this.channel.addSetup(async (ch: ConfirmChannel) => {
      await ch.assertExchange(exchange, exchangeType, { durable });
    });
    await this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
    this.logger.log(`Published message → ${routingKey}`);
  }

  async consume(
    queue: string,
    onMessage: (data: any) => Promise<void>,
    exchange?: string,
    routingKey?: string,
    exchangeType: 'direct' | 'topic' | 'fanout' | 'headers' = 'topic',
    durable?: true,
  ) {
    await this.channel.addSetup(async (ch: ConfirmChannel) => {
      if (exchange && routingKey) {
        await ch.assertExchange(exchange, exchangeType, { durable });
        await ch.assertQueue(queue, { durable });
        await ch.bindQueue(queue, exchange, routingKey);
      }

      await ch.consume(queue, async (msg) => {
        if (!msg) return;

        try {
          const content = JSON.parse(msg.content.toString());
          await onMessage(content);
          ch.ack(msg);
        } catch (err) {
          this.logger.error(`❗ Error processing message: ${err.message}`);
          ch.nack(msg, false, false);
        }
      });

      this.logger.log(`🎧 Consumer started on queue [${queue}]`);
    });
  }
}
