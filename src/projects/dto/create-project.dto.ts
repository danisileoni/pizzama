import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(30)
  @MinLength(5)
  title: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  @MaxLength(1000)
  @MinLength(10)
  description: string;
}
