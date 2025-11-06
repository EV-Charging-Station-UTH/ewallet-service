import { Global, Module } from '@nestjs/common';
import { HashService } from './libs/hash/hash.service';

@Global()
@Module({
  imports: [],
  providers: [HashService],
  exports: [HashService],
})
export class CommonModule {}
