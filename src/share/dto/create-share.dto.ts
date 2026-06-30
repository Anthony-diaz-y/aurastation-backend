import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateShareDto {
  @IsNumber()
  @IsNotEmpty()
  recipientId!: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'El formato de fecha debe ser YYYY-MM-DD',
  })
  sharedDate!: string;

  @IsNumber()
  @IsOptional()
  logId?: number;
}
