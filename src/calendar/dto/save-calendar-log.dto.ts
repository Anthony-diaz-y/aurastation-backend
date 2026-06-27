import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
} from 'class-validator';

export class SaveCalendarLogDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'El formato de fecha debe ser YYYY-MM-DD',
  })
  date!: string;

  @IsNumber()
  @IsOptional()
  bpm?: number;

  @IsString()
  @IsOptional()
  stressLevel?: string;

  @IsString()
  @IsOptional()
  registrationTime?: string;

  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  note?: string;
}
