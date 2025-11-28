import express from 'express';
import cors from 'cors';
import { router } from './routes/routes';

const app = express();

app.use(cors());        
app.use(express.json()); 

app.use(router);

app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

export { app };