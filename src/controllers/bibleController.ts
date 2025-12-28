import { Request, Response } from 'express';
import { bibleService } from '../services/bibleService';

export const bibleController = {
  async getBooks(req: Request, res: Response) {
    try {
      const books = await bibleService.getBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar livros da Bíblia' });
    }
  },

  async getVerses(req: Request, res: Response) {
    try {
      const { version, book, chapter } = req.params;
      const verses = await bibleService.getVerses(version, book, Number(chapter));
      res.json(verses);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar versículos' });
    }
  }
};
