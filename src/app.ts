import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes/index';

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

export default app;
