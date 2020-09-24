import { inject, injectable } from 'inversify';
import * as firebase from 'firebase';
import { TYPES } from '../util/ioc-types';
import { OrdersRepository } from '../repositories/orders-repository';

@injectable()
export class OrdersService {
  constructor(
    @inject(TYPES.Firebase) private realtimeStorage: firebase.database.Database,
    @inject(TYPES.OrdersRepository) private repository: OrdersRepository,
  ) {}

  async save(order: any) {
    const { restaurant } = order;
    const { id } = await this.repository.create(order);
    this.realtimeStorage.ref(`restaurants/${restaurant}/${id.toString()}`).set({
      order: id.toString(),
      status: 'open',
    });
  }

  get() {
    return this.repository.findAll();
  }

  getById(id: string) {
    return this.repository.findById(id);
  }
}
