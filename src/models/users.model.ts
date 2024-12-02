import { model, Schema, Document } from 'mongoose';
import { User } from '@interfaces/users.interface';

const mongoose = require('mongoose');

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
    unique: true,
  },
  profilePicture: {
    type: String,
    default: '',
    required: false,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
