import {
  IsArray,
  IsDate,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

export class CreateTaskDto {
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  title: string;

  @IsString()
  @MaxLength(5000)
  @MinLength(500)
  description: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  backOrFront: string;

  @IsArray()
  @IsString({ each: true })
  projectId: MongooseSchema.Types.ObjectId[];

  @IsArray()
  @IsString({ each: true })
  userId: MongooseSchema.Types.ObjectId[];
}
