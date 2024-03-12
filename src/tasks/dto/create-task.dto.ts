import {
  IsIn,
  IsMongoId,
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

  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;

  @IsString()
  @IsIn(['back', 'front'])
  backOrFront: string;

  @IsMongoId()
  projectId: MongooseSchema.Types.ObjectId;

  @IsMongoId()
  userId: MongooseSchema.Types.ObjectId;
}
