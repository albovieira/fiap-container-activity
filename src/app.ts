import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as expressWinston from 'express-winston';
import * as cors from 'cors';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Logger } from 'winston';
import { TYPES } from './util/ioc-types';

import requestMetadata from './middlewares/request-metadata';
import correlationId from './middlewares/correlation-id';
import errorProcessor from './middlewares/error-processor';

export default async function (container: Container) {
  const server = new InversifyExpressServer(container);

  const logger = container.get<Logger>(TYPES.Logger);

  server.setConfig((app) => {
    app.disable('x-powered-by');
    app.use(bodyParser.json());
    app.use(cors());
    app.use(compression());
    app.use(correlationId());
    app.use(requestMetadata());

    /**
     * Configuração de log de requisições.
     */
    app.use(
      expressWinston.logger({
        winstonInstance: logger as any,
        meta: true,
        expressFormat: true,
        dynamicMeta: (req) => ({ correlationId: req.correlationId }),
      }),
    );
  });

  server.setErrorConfig((app) => {
    app.use(errorProcessor(logger));
  });

  return server.build();
}
