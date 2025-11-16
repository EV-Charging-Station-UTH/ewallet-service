import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, logLevel } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;

  private kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    logLevel: logLevel.INFO,
  });

  async onModuleInit() {
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
    });

    await this.producer.connect();
    console.log('[Kafka Producer] Connected');
  }

  async sendMessage(topic: string, message: unknown) {
    try {
      await this.producer.send({
        topic,
        acks: -1, // wait for all replicas (safe)
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });

      console.log(`[Kafka Producer] Sent message to ${topic}`);
    } catch (error) {
      console.error(`[Kafka Producer] Error sending to ${topic}:`, error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('[Kafka Producer] Disconnected');
  }
}
