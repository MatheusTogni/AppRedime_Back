// src/index.ts
import 'dotenv/config'; // Carrega variáveis de ambiente
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import authRouter from './routers/authRouter';
import postagensRouter from './routers/postsRouter'
import { authenticateToken } from './middleware/authMiddleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing de JSON e FormData
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (imagens uploaded)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas
app.use('/auth', authRouter);
app.use('/post', postagensRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});