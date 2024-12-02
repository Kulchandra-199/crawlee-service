import type { ObjectId } from 'mongoose';

export interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  profilePicture: string;
  bio: string;
  profession: string;
  age: number;
  friends: ObjectId[];
  following: ObjectId[];
  createdAt: Date;
}
