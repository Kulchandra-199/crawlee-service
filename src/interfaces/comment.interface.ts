import type { ObjectId } from 'mongoose';

export interface Comment {
  _id: string;
  user: ObjectId;
  post: ObjectId[];
  content: string;
  likes: ObjectId[];
  createdAt: Date;
}
