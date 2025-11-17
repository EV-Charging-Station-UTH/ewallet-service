import { Body, Controller, Post, Req } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer.service';

@Controller('kafka')
export class KafkaController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post('producer')
  producer(@Body() body: { topic: string; message: unknown }) {
    console.log('[Kafka Controller] Topic:', body.topic);
    console.log('[Kafka Controller] Received message to produce:', body.message);
    return this.kafkaProducerService.sendMessage(body.topic, body.message);
  }
}
