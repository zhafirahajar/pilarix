import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialTransactionDto } from './create-material-transaction.dto';

export class UpdateMaterialTransactionDto extends PartialType(CreateMaterialTransactionDto) {}
