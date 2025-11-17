import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaController } from './kafka.controller';

@Module({
  controllers: [KafkaController],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
