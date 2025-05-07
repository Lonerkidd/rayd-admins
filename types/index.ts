import { Document } from 'mongoose'


//Create a user Interface type

export interface IUser extends Document {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}


// // Extend the session user type to include 'id' and 'role'
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       role: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
// }



// Blog Form types
export interface BlogFormValues {
  id?:string;
  title: string;
  content: string;
  // slug: string;
  // excerpt: string;
  // tags: string;
  category: string;
  client: string;
  image?: File | string | null;
  video?: string;
  // author?: string;
}

export interface BlogFormProps {
  defaultValues?: Partial<BlogFormValues>;
  mode: 'create' | 'edit';
  onSubmit?: (values: BlogFormValues) => Promise<void>;
}

export interface FormValues {
  title: string;
  content: string;
  // slug: string;
  // excerpt: string;
  // tags: string;
  author:string
  video?: string;
  image?: File | string | null;
}

//Portfolio Types
export interface PortfolioItem {
    _id: string;
    title: string;
    content: string;
    image: string;
    category: string;
    client: string;
    videoLink?: string;
    photoLink?: string;
  }

export interface IUser {
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
  }

export interface Project {
  _id?: string;
  title: string;
  content: string;
  image?: string;
  slug: string;
  excerpt: string;
  video?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
}