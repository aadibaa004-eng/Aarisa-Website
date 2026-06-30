import mongoose, { Schema, Document, Model } from "mongoose";

export type ContactStatus = "new" | "contacted" | "closed";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  goal: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    goal: {
      type: String,
      required: [true, "Goal is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["new", "contacted", "closed"],
        message: "Status must be new, contacted, or closed",
      },
      default: "new",
    },
  },
  { timestamps: true }
);

ContactSchema.index({ status: 1, createdAt: -1 });

const Contact: Model<IContact> =
  mongoose.models.Contact ?? mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
