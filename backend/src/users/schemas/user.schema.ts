import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  firebaseUid: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  bio: string;

  @Prop()
  profileImage: string;

  @Prop({ type: [String], default: [] })
  followers: string[];

  @Prop({ type: [String], default: [] })
  following: string[];

  @Prop({ type: [String], default: [] })
  achievements: string[];

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: Date.now })
  lastActivityAt: Date;

  @Prop({ type: [String], default: [] })
  friends: string[];

  @Prop({
    type: {
      notifications: { type: Boolean, default: true },
      language: { type: String, default: "ko" },
    },
    default: {},
  })
  settings: {
    notifications: boolean;
    language: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
