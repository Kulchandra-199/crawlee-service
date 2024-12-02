import * as braintree from 'braintree';

export class PaymentService {
  private gateway: braintree.BraintreeGateway;
  private token: string;
  private customerid: string;

  // constructor() {

  // }

  public async createCustomer(customerInfo?: braintree.CustomerCreateRequest): Promise<string> {
    try {
      this.gateway = new braintree.BraintreeGateway({
        environment: braintree.Environment.Sandbox,
        merchantId: 's6b9ksxk24v6bksr',
        publicKey: '6xqj7h7xf6r26dnn',
        privateKey: 'fdaa846ae36ac0dfe4e183757a3b4313',
      });
      let data = {
        deviceSessionId: '12222',
      };

      const result = await this.gateway.customer.create(data);
      if (result.success) {
        this.customerid = result.customer.id;
        const token = await this.generateToken();
        return token;
      } else {
        throw new Error('Failed to create customer: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  public async generateToken(customerId: string = this.customerid): Promise<string> {
    try {
      console.log(this.gateway, '-----------');
      const response = await this.gateway.clientToken.generate({ customerId });
      this.token = response.clientToken;
      console.log(response, '-------clientToken');
      return this.token;
    } catch (error) {
      console.error('Error generating client token:', error);
      throw error;
    }
  }
  
}
