import mongoose,{CallbackError, Schema,Model } from "mongoose"
import {IUser} from "@/types";
import bcrypt from "bcryptjs";



const userSchema = new Schema<IUser> ({
        id: {
            type: String,
            required: true,
            unique: true,
            immutable: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'admin',
        },
    },
    {
        timestamps: true
    }
);

//Hash User password before saving
userSchema.pre('save',async function (next) {
    if(!this.isModified('password'))return next();

    try{
       const salt = await bcrypt.genSalt(10);
       this.password = await bcrypt.hash(this.password, salt);
       next();
    }catch (e) {
        next(e as CallbackError);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Export the model, handling possible model overwrite warnings
const User = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', userSchema);

export default User;