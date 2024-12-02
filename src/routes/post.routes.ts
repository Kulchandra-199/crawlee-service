import { Router } from 'express';
import PostController from '@/controllers/post.controller';
import { Routes } from '@/interfaces/routes.interface';

class PostsRoute implements Routes {
  public path = '/posts';
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.postController.getPost);
    this.router.post(`${this.path}`, this.postController.createPost);
    //this.router.post(`${this.path}/:id/like`, this.postController.likePost);
    this.router.post(`${this.path}/:id/comment`, this.postController.commentPost);
  }
}

  export default PostsRoute;
