import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate unique slug from title
BlogSchema.pre("save", async function (next) {
  if (!this.isModified("title") && this.slug) return next();

  const base = slugify(this.title, { lower: true, strict: true, trim: true });
  let slug = base;
  let counter = 1;

  // Ensure slug uniqueness
  while (
    await (mongoose.models.Blog as Model<IBlog>).exists({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${base}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

// Full-text search index
BlogSchema.index({ title: "text", excerpt: "text", content: "text" });
BlogSchema.index({ category: 1 });
BlogSchema.index({ published: 1, createdAt: -1 });

const Blog: Model<IBlog> =
  mongoose.models.Blog ?? mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
