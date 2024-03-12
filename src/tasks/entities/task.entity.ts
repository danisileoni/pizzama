import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop({
    require: true,
    index: true,
  })
  title: string;

  @Prop({
    require: true,
    index: true,
  })
  description: string;

  @Prop({
    require: true,
    index: true,
  })
  startDate: Date;

  @Prop({
    require: true,
    index: true,
  })
  endDate: Date;

  @Prop({
    require: true,
    index: true,
  })
  backOrFront: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Project' }],
    require: true,
    index: true,
  })
  projectId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Project' }],
    require: true,
    index: true,
  })
  userId: MongooseSchema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
