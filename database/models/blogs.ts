import mongoose, { Schema } from 'mongoose';

// Define the Blog interface
interface IBlog {
    _id: string; 
    title: string;
    content: string;
    image: string;
    client:string;
    video?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Create Schema for the company's blog post
const blogSchema = new Schema<IBlog>({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
    },
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
    client:{
     type:String,
     required:true,
    },
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
