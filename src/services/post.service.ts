import { HttpException } from '@/exceptions/HttpException';
import { Post } from '@/interfaces/post.interface';
import postModel from '@/models/post.model';
import { isEmpty } from 'class-validator';
import { Types } from 'mongoose';

class PostService {
  public posts = postModel;

  public async findAllPost(): Promise<Post[]> {
    const posts: Post[] = await this.posts.find();
    return posts;
  }

  public async createPost(postData: Partial<Post>): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'post data is empty');
    const createPostData = await this.posts.create({ ...postData });
    return createPostData;
  }

  public async likePost(id: string, userId: string): Promise<Post> {
    if (isEmpty(id)) throw new HttpException(400, 'no id passed');
    if (isEmpty(userId)) throw new HttpException(400, 'no user id passed');

    const findPost: Post = await this.posts.findOne({ _id: id });
    if (!findPost) throw new HttpException(404, 'no post found');

    const userIdObj = new Types.ObjectId(userId);

    let updateOperation;
    if (findPost.likes.includes(userIdObj)) {
      // Unlike the post
      updateOperation = { $pull: { likes: userIdObj } };
    } else {
      // Like the post
      updateOperation = { $addToSet: { likes: userIdObj } };
    }

    const updatePostById: Post = await this.posts.findByIdAndUpdate(id, updateOperation, { new: true });

    if (!updatePostById) throw new HttpException(409, 'Failed to update post');
    return updatePostById;
  }

  public async commentPost(id: string, userId: string, content: string): Promise<Post> {
    if (isEmpty(id)) throw new HttpException(400, 'no id passed');
    if (isEmpty(userId)) throw new HttpException(400, 'no user id passed');
    if (isEmpty(content)) throw new HttpException(400, 'comment content is empty');

    const findPost: Post = await this.posts.findOne({ _id: id });
    if (!findPost) throw new HttpException(404, 'no post found');

    const newComment = {
      user: new Types.ObjectId(userId),
      content: content,
      createdAt: new Date(),
    };

    const updatePostById: Post = await this.posts.findByIdAndUpdate(id, { $push: { comments: newComment } }, { new: true });

    if (!updatePostById) throw new HttpException(409, 'Failed to update post');
    return updatePostById;
  }
}

export default PostService;
