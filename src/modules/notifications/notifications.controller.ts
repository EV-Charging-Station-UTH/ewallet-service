import { Controller, Post, Body } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { FirebaseRepository } from 'src/firebase/firebase.repository';

@Controller()
export class NotificationController {
  constructor(private readonly firebaseRepository: FirebaseRepository) {}

  @EventPattern('notifications.device')
  sendToDevice(
    @Payload() data: { token: string; title: string; body: string },
  ) {
    return this.firebaseRepository.sendToDevice(
      data.token,
      data.title,
      data.body,
    );
  }

  @Post('topic')
  sendToTopic(@Body() body: { topic: string; title: string; body: string }) {
    return this.firebaseRepository.sendToTopic(
      body.topic,
      body.title,
      body.body,
    );
  }
}
