import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Schema()
export class Report extends Document {
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Project' }],
  })
  projectId: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [Object],
  })
  user: User[];

  @Prop({
    default: [],
    required: true,
    index: true,
  })
  title: string[];

  @Prop({
    default: [],
    required: true,
    index: true,
  })
  description: string[];
}

export const ReportSchema = SchemaFactory.createForClass(Report);
