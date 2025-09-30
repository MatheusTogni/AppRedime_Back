// src/index.ts
import 'dotenv/config'; 
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routers/authRouter';
import postagensRouter from './routers/postsRouter'
import ministrationRouter from './routers/ministrationRouter';
import calendarioRouter from './routers/calendarioRouter';
import { authenticateToken } from './middleware/authMiddleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://missaoredimepzo.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/auth', authRouter);
app.use('/post', postagensRouter);
app.use('/ministration', ministrationRouter);
app.use('/calendario', calendarioRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});