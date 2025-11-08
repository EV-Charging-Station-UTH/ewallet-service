import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { Message, Messaging, MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseRepository {
  private readonly messaging: Messaging;

  constructor(@Inject('FIREBASE_APP') private readonly firebaseApp: app.App) {
    this.messaging = this.firebaseApp.messaging();
  }

  async sendToDevice(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: Message = {
      token,
      notification: { title, body },
      data: data || {},
    };

    return this.messaging.send(message);
  }

  async sendToMultiple(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: MulticastMessage = {
      tokens,
      notification: { title, body },
      data: data || {},
    };

    return this.messaging.sendEachForMulticast(message);
  }

  async sendToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: Message = {
      topic,
      notification: { title, body },
      data: data || {},
    };

    return this.messaging.send(message);
  }

  async subscribeToTopic(tokens: string[], topic: string) {
    return this.messaging.subscribeToTopic(tokens, topic);
  }

  async unsubscribeFromTopic(tokens: string[], topic: string) {
    return this.messaging.unsubscribeFromTopic(tokens, topic);
  }
}
