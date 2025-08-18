// src/index.ts
import 'dotenv/config'; // Carrega variáveis de ambiente
import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './config/database'; 
import authRouter from './routers/authRouter';
import { authenticateToken } from './middleware/authMiddleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});