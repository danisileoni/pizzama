import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
    default: ['user-role'],
    unique: false,
    index: true,
  })
  role: string[];

  token;
}

export const UserSchema = SchemaFactory.createForClass(User);
