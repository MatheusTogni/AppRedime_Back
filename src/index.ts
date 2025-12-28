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

// Configuração CORS mais permissiva para desenvolvimento
const allowedOrigins = [
  'https://missaoredimepzo.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://10.0.0.138:3001', // IP local da rede
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como mobile apps, Postman, etc) ou origins permitidas
    if (!origin || allowedOrigins.includes(origin) || origin.match(/^http:\/\/localhost:\d+$/) || origin.match(/^http:\/\/127\.0\.0\.1:\d+$/) || origin.match(/^http:\/\/10\.0\.0\.\d+:\d+$/)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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