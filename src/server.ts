import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import PostsRoute from './routes/post.routes';
import PaymentRoute from './routes/payment.route';
import CrawleeRoute from './routes/crawlee.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new PostsRoute(), new PaymentRoute(), new CrawleeRoute()]);

app.listen();
