import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FirebaseRepository } from "./firebase.repository";
import { firebaseProvider } from "./firebase.provider";

@Module({
  imports: [ConfigModule],
  providers: [firebaseProvider, FirebaseRepository],
  exports: [FirebaseRepository],
})
export class FirebaseModule {}