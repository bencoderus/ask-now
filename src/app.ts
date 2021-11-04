import 'reflect-metadata';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { NextFunction, Response, Request } from 'express';

import config from './config';
import routes from './routes/index';
import handleException from './utils/handleException';

const app = express();

app.use(
  morgan('tiny', {
    skip: (request, response) => config.environment === 'test'
  })
);

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    return handleException(error, request, response);
  }
);

app.use(routes);

export default app;
