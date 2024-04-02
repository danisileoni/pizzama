import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @MaxLength(50)
  @MinLength(1)
  title: string;

  @IsString()
  @MaxLength(2000)
  description: string;
}
