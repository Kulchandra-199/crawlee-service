import { Routes } from '@/interfaces/routes.interface';

import { Router } from 'express';
import paymentController from '../controllers/payment.controller';

class PaymentRoute implements Routes {
  public path = '/payment';
  public paymentController = new paymentController();

  public router = Router();

  constructor() {
    this.InitializeRoutes();
  }

  private InitializeRoutes() {


    try{
      this.router.post(`${this.path}/:id`, this.paymentController.getToken);
    }catch(err){
      console.log(err);
    }
  
  }
}

export default PaymentRoute;
