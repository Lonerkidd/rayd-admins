import mongoose, { Schema } from 'mongoose';

// Define the Blog interface
interface IBlog {
    _id: string; 
    title: string;
    content: string;
    image?: Buffer;
    imageType?: string;
    client: string;
    video?: string;
    slug: string; // Changed to required
    excerpt?: string;
    tags?: string[];
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
        type: Buffer,
        required: false,
    },
    imageType: {
        type: String,
        required: false,
    },
    video: {
        type: String,
        required: false,
    },
    client: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true, // Ensure slugs are unique
    },
    excerpt: {
        type: String,
        required: false,
    },
    tags: {
        type: [String],
        required: false,
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

// Generate a URL-friendly slug from the title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word chars
        .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '')   // Remove leading/trailing hyphens
        .substring(0, 100);        // Limit length
}

// Add pre-save middleware to generate slug if not provided
blogSchema.pre('save', function(next) {
    // Update the updatedAt timestamp
    this.updatedAt = new Date();
    
    // Generate slug from title if not provided
    if (!this.slug && this.title) {
        this.slug = generateSlug(this.title);
    }
    
    // Add a random string to ensure uniqueness if still missing
    if (!this.slug) {
        const randomString = Math.random().toString(36).substring(2, 10);
        this.slug = `post-${randomString}`;
    }
    
    next();
});

// Check if the model exists before creating it
const Blog = (mongoose.models.Blog as mongoose.Model<IBlog>) || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
