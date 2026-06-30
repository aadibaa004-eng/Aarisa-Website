import mongoose, { Schema, Document, Model } from "mongoose";

export type GalleryType = "before" | "after" | "general";

export interface IGallery extends Document {
  image: string;
  caption: string;
  type: GalleryType;
  createdAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    caption: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Caption cannot exceed 300 characters"],
    },
    type: {
      type: String,
      enum: {
        values: ["before", "after", "general"],
        message: "Type must be before, after, or general",
      },
      required: [true, "Type is required"],
    },
  },
  { timestamps: true }
);

GallerySchema.index({ type: 1, createdAt: -1 });

const Gallery: Model<IGallery> =
  mongoose.models.Gallery ??
  mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
