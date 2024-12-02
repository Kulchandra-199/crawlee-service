import type { ObjectId } from 'mongoose';

export interface Post {
  _id: number;
  user_id: number;
  post: string;
  media: string[];
  attributes: Record<string, string>;
  time: string;
  comments: ObjectId[];
  createdAt: Date;
  likes: ObjectId[];
}
