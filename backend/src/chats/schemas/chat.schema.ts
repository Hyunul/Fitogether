import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChatDocument = Chat & Document;

@Schema()
export class Chat extends Document {
  @Prop({ required: true })
  type: "DIRECT" | "GROUP" | "CHALLENGE";

  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: "User", required: true })
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: "Challenge" })
  challenge?: Types.ObjectId;

  @Prop({
    type: [
      {
        userId: Types.ObjectId,
        content: String,
        type: {
          type: String,
          enum: ["TEXT", "IMAGE", "FILE"],
          default: "TEXT",
        },
        fileUrl: String,
        createdAt: Date,
        updatedAt: Date,
      },
    ],
    default: [],
  })
  messages: Array<{
    userId: Types.ObjectId;
    content: string;
    type: "TEXT" | "IMAGE" | "FILE";
    fileUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }>;

  @Prop({
    type: Map,
    of: Date,
    default: new Map(),
  })
  lastRead: Map<string, Date>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
