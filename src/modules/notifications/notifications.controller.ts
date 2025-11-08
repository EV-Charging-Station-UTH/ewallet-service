import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseRepository } from 'src/firebase/firebase.repository';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly firebaseRepository: FirebaseRepository) {}

  @Post('device')
  sendToDevice(@Body() body: { token: string; title: string; body: string }) {
    return this.firebaseRepository.sendToDevice(
      body.token,
      body.title,
      body.body,
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
