import * as express from 'express';
import { inject } from 'inversify';
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  requestParam,
  requestBody,
  response,
} from 'inversify-express-utils';
import { OrdersService } from '../services/orders-service';
import { HttpStatus } from '../util/http-status';
import { TYPES } from '../util/ioc-types';

@controller('/orders')
export class OrdersController implements interfaces.Controller {
  constructor(@inject(TYPES.OrdersService) private service: OrdersService) {}

  @httpGet('/')
  async get() {
    const orders = await this.service.get();
    return orders;
  }

  @httpGet('/:id')
  async getById(@requestParam('id') id: string) {
    const order = await this.service.getById(id);
    return order;
  }

  @httpPost('/')
  async create(@response() res: express.Response, @requestBody() order: any) {
    await this.service.save(order);
    res.sendStatus(HttpStatus.CREATED);
  }
}
