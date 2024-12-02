import { NextFunction, Request, Response } from 'express';
import { Post } from '@/interfaces/post.interface';
import PostService from '@/services/post.service';

class PostController {
  public postService = new PostService();

  public getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const data =[
        { "id": 1, "name": "Amazon", "url": "https://amazon.com", 'identifiers': [] },
        { "id": 2, "name": "Google", "url": "https://google.com", 'identifiers': [] },
        { "id": 3, "name": "OpenAI", "url": "https://openai.com", 'identifiers': [] }
      ]
      
      // const findAllPostData = await this.postService.findAllPost();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postData = req.body;
      const createPost = await this.postService.createPost(postData);
      res.status(201).json({ data: createPost, message: 'post created' });
    } catch (error) {
      next(error);
    }
  };

  public likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      console.log(postId, req.body);
      const { userId } = req.body; // Assuming you have user authentication middleware
      const updatedPost = await this.postService.likePost(postId, userId);
      res.status(200).json({ data: updatedPost, message: 'post liked/unliked' });
    } catch (error) {
      next(error);
    }
  };

  public commentPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const userId = req.body.id; // Assuming you have user authentication middleware
      const { content } = req.body;
      const updatedPost = await this.postService.commentPost(postId, userId, content);
      res.status(201).json({ data: updatedPost, message: 'comment added' });
    } catch (error) {
      next(error);
    }
  };
}

export default PostController;
