// endpoints 
// 1. POST /crawl  response - 200 ok worker_id : number 
// Body{
//   crawleeConfig : CrawleeConfig
// }


// 2. GET /crawl:id/status response - 200 ok status : string
// 3. GET /crawl:id/result response - 200 ok result : CrawleeResult
// 4. GET /crawl/queue response - 200 ok queue : string[]





import {Router} from 'express';
import CrawleeController from '@/controllers/crawlee.controller';
import { Routes } from '@/interfaces/routes.interface';


class CrawleeRoute  implements Routes {
    public path = '/crawlee';
    public router = Router();
    public crawleeController = new CrawleeController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.crawleeController.createCrawlee);
        // this.router.get(`${this.path}/:id/status`, this.crawleeController.getCrawleeStatus);
        // this.router.get(`${this.path}/:id/result`, this.crawleeController.getCrawleeResult);
        // this.router.get(`${this.path}/queue`, this.crawleeController.getCrawleeQueue);
    }
}

export default CrawleeRoute