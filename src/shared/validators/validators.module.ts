import { Module, Global } from '@nestjs/common';
import { DocumentValidator } from './document.validator';

@Global()
@Module({
  providers: [DocumentValidator],
  exports: [DocumentValidator],
})
export class ValidatorsModule {}
