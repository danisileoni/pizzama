import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
@Schema()
export class User extends Document {
  @Prop({
    required: true,
    unique: false,
    index: true,
  })
  fullName: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  user: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: false,
    index: true,
  })
  password: string;

  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean;

  @Prop({
    default: ['user'],
    unique: false,
    index: true,
  })
  roles: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Project' }] })
  assignedProjects: MongooseSchema.Types.ObjectId[];

  token;
}

export const UserSchema = SchemaFactory.createForClass(User);
