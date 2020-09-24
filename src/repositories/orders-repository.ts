import { injectable } from 'inversify';
import * as uuid from 'uuid';
import { Collection, ObjectId } from 'mongodb';
import getMongoCollection from '../util/mongo-database';

@injectable()
export class OrdersRepository {
  get collection(): Promise<Collection> {
    return getMongoCollection('orders');
  }

  async findById(id: string): Promise<any> {
    const collection = await this.collection;
    return collection.findOne({ _id: new ObjectId(id) })!;
  }

  async findAll() {
    const collection = await this.collection;
    return collection.find({}).toArray();
  }

  async create(order: any): Promise<any> {
    try {
      const collection = await this.collection;
      order.createdAt = new Date();
      order.updatedAt = new Date();
      const { result } = await collection.insertOne(order);
      return { done: result.ok > 0, id: order._id };
    } catch (error) {
      throw new Error(`Error on order database upsert: ${error.message}`);
    }
  }

  async update(id: string, order: any): Promise<any> {
    try {
      const collection = await this.collection;
      order.updatedAt = new Date();
      const { result } = await collection.updateOne(
        {
          _id: id,
        },
        {
          $set: order,
        },
      );
      return { done: result.ok > 0 };
    } catch (error) {
      throw new Error(`Error on order database upsert: ${error.message}`);
    }
  }

  async remove(id: string) {
    const collection = await this.collection;
    const r = await collection.remove({
      _id: id,
    });
    return { done: true };
  }
}
