import { Module } from '@nestjs/common';
import { NotificationController } from './notifications.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';


@Module({
  imports: [FirebaseModule],
  controllers: [NotificationController],
  providers: [FirebaseModule],
})
export class NotificationModule {}
