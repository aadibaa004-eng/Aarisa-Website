import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  clientName: string;
  review: string;
  rating: number;
  image: string;
  weightLost: string;
  city: string;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    image: {
      type: String,
      default: "",
    },
    weightLost: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ approved: 1, createdAt: -1 });

const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
