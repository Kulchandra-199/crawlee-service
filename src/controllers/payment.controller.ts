import { PaymentService } from '@/services/payment.service';
import { NextFunction, Request, Response } from 'express';

class paymentController {
  public paymentService = new PaymentService();

  public getToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const Id: number = req.params.id;
      console.log(req.params.id);

      const token = await this.paymentService.createCustomer();

      res.status(200).json({ data: token, message: 'token generated' });
    } catch (err) {
      console.log('err');
    }
  };
}

export default paymentController;
