import mongoose from 'mongoose';

interface GlobalWithMongoose {
    mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

// Cast the global object to include the mongoose property
const globalWithMongoose = global as unknown as GlobalWithMongoose;

// Initialize the mongoose property if it doesn't exist
if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = {
        conn: null,
        promise: null,
    };
}

/**
 * Connect to MongoDB with Mongoose
 * @returns Mongoose instance
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
    if (globalWithMongoose.mongoose?.conn) {
        return globalWithMongoose.mongoose.conn;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    if (!globalWithMongoose.mongoose?.promise) {
        const opts = {
            bufferCommands: false,
        };

        globalWithMongoose.mongoose!.promise = mongoose.connect(process.env.MONGODB_URI, opts);
    }

    try {
        globalWithMongoose.mongoose!.conn = await globalWithMongoose.mongoose!.promise;
    } catch (e) {
        globalWithMongoose.mongoose!.promise = null;
        throw e;
    }

    return globalWithMongoose.mongoose!.conn;
}