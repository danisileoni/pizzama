import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Project extends Document {
  @Prop({
    unique: true,
    required: true,
    index: true,
  })
  name: string;

  @Prop({
    required: true,
    index: true,
  })
  startDate: Date;

  @Prop({
    required: true,
    index: true,
  })
  endDate: Date;

  @Prop({
    required: true,
    index: true,
  })
  description: string;

  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean;

  @Prop({
    unique: true,
    index: true,
  })
  slug: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
