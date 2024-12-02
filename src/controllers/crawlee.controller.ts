// import { NextFunction, Request, Response } from 'express';
// import {EcommerceCrawler} from '@services/crawlee.service'
// import type {CrawlerConfig } from "@services/crawlee.service" 
// import Bull from 'bull'

// class CrawleeController {
// //   public crawleeService = new CrawleeService();
   
    
//    public createCrawlee = async (req: Request, res: Response, next: NextFunction) => {
//     try{
//         const crawleeConfig: CrawlerConfig = req.body
//         if (!crawleeConfig || Object.keys(crawleeConfig).length === 0) {
//             return res.status(400).json({ error: 'Invalid or missing crawler configuration' });
//           }

//           const queue = new Bull('crawlee-queue',{
//             redis: {
//                 host: 'host.docker.internal', // for Docker container to reach local machine
//                 port: 6379
//             }
//           });

//           queue.process(async (job) => {

//           });


//         let crawler = new EcommerceCrawler(crawleeConfig);
//         crawler.run()
//         let id = await crawler.crawleeId()
//         res.status(200).json({ data: {worker_id: id}, message: 'crawlee created' });

//     }catch(error){
//         next(error)
//     }
//    };

// }


// export default CrawleeController;


import { NextFunction, Request, Response } from 'express';
import { EcommerceCrawler } from '@services/crawlee.service';
import type { CrawlerConfig } from "@services/crawlee.service";
import Bull from 'bull';
import { Job } from 'bull';

class CrawleeController {
    private queue: Bull.Queue;

    constructor() {
        // Initialize the queue in the constructor
        this.queue = new Bull('crawlee-queue', {
            redis: {
                host: 'host.docker.internal',
                port: 6379
            },
            // Add settings for job attempts and backoff strategy
            settings: {
                maxStalledCount: 3,
                stalledInterval: 30000 // 30 seconds
            }
        });

        // Set up queue processing
        this.setupQueueProcessing();
    }

    private setupQueueProcessing() {
        this.queue.process(async (job: Job) => {
            try {
                // Extract crawler configuration from the job data
                const crawleeConfig: CrawlerConfig = job.data.config;

                // Create and run the crawler
                const crawler = new EcommerceCrawler(crawleeConfig);
                const dataset = await crawler.run();

                // Generate a unique ID for this crawl
                const crawlId = await crawler.crawleeId();

                // Optional: Process or store the dataset
                // You might want to implement more complex logic here
                const datasetItems = await dataset.getData();

                return {
                    crawlId,
                    processedItems: datasetItems.length
                };
            } catch (error) {
                // Log the error and rethrow to mark the job as failed
                console.error('Crawlee job processing error:', error);
                throw error;
            }
        });

        // Optional: Set up event listeners for job lifecycle
        this.queue.on('completed', (job, result) => {
            console.log(`Job ${job.id} completed with result:`, result);
        });

        this.queue.on('failed', (job, err) => {
            console.error(`Job ${job.id} failed with error:`, err);
        });
    }

    public createCrawlee = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const crawleeConfig: CrawlerConfig = req.body;

            // Validate crawler configuration
            if (!crawleeConfig || Object.keys(crawleeConfig).length === 0) {
                return res.status(400).json({ error: 'Invalid or missing crawler configuration' });
            }

            // Add job to the queue
            const job = await this.queue.add(
                { config: crawleeConfig }, 
                { 
                    // Optional job options
                    attempts: 3, // Retry failed jobs up to 3 times
                    backoff: {
                        type: 'exponential',
                        delay: 1000 // Initial delay of 1 second
                    }
                }
            );

            // Respond with job ID for tracking
            res.status(200).json({ 
                data: { 
                    job_id: job.id,
                    message: 'Crawlee job queued successfully' 
                }
            });
        } catch (error) {
            next(error);
        }
    };

    // Method to get job status
    public getJobStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = req.params.jobId;
            const job = await this.queue.getJob(jobId);

            if (!job) {
                return res.status(404).json({ error: 'Job not found' });
            }

            const state = await job.getState();
            const result = await job.returnvalue;

            res.status(200).json({
                job_id: job.id,
                state,
                result
            });
        } catch (error) {
            next(error);
        }
    };
}

export default CrawleeController;