import {
  IsIn,
  IsMongoId,
  IsString,
  Matches,
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
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  startDate: Date;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  endDate: Date;

  @IsString()
  @IsIn(['back', 'front'])
  backOrFront: string;

  @IsMongoId()
  projectId: MongooseSchema.Types.ObjectId;

  @IsMongoId()
  userId: MongooseSchema.Types.ObjectId;
}
