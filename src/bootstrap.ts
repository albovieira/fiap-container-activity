import { Container } from 'inversify';
import { Logger } from 'winston';
import { TYPES } from './util/ioc-types';
import createLogger from './util/logger';
import createCache from './util/cache';
import createFirebase from './util/firebase';
import './controllers/orders-controller';

import { OrdersService } from './services/orders-service';
import { OrdersRepository } from './repositories/orders-repository';

export default async function (): Promise<Container> {
  const container = new Container({ autoBindInjectable: true });
  const logger = createLogger();
  container.bind<Logger>(TYPES.Logger).toConstantValue(logger);

  const cache = createCache();
  container.bind(TYPES.Cache).toConstantValue(cache);

  const firebase = createFirebase();
  container.bind(TYPES.Firebase).toConstantValue(firebase);

  // Services
  container.bind(TYPES.OrdersService).to(OrdersService).inSingletonScope();

  // Repositories
  container
    .bind(TYPES.OrdersRepository)
    .to(OrdersRepository)
    .inSingletonScope();

  return container;
}
