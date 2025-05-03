import mongoose, { Schema } from 'mongoose';

// Define the Blog interface
interface IBlog {
  title: string;
  content: string;
  image: string;
  slug: string;
  excerpt: string;
  // author: mongoose.Types.ObjectId | string; // Add proper typing for author
  video?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Create Schema for the company's blog post
const blogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters long']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    image: {
        type: String,
        required: false,
    },
    video: {
        type: String,
        required: false,
    },
    tags: [{
        type: String,
        required: false,
    }],
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
 

// Add pre-save middleware to generate slug if not provided
blogSchema.pre('save', function(next) {
    // Update the updatedAt timestamp
    this.updatedAt = new Date();
    
    next();
});

// Check if the model exists before creating it
const Blog = (mongoose.models.Blog as mongoose.Model<IBlog>) || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
