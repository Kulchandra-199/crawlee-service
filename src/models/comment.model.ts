import { model, Schema, Document } from 'mongoose';

const mongoose = require('mongoose');
import { Comment } from '@/interfaces/comment.interface';

const commentSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

const commentModel = model<Comment & Document>('Comment', commentSchema);

export default commentModel;
