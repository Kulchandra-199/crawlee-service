import { model, Schema, Document } from 'mongoose';
import { Post } from '@interfaces/post.interface';

const mongoose = require('mongoose');

const postSchema: Schema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  media: {
    type: String,
    require: false,
  },
  createdAt: {
    type: Date,
    require: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const postModel = model<Post & Document>('Post', postSchema);

export default postModel;
