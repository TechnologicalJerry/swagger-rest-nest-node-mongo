import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  loginTimestamp: Date;

  @Prop({ required: false })
  logoutTimestamp?: Date;

  @Prop({ required: true, enum: ['active', 'logged_out'], default: 'active' })
  status: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
