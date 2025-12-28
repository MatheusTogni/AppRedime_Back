import axios from 'axios';

const API_BASE_URL = 'https://getbible.net/v2';

// Mapeamento de versões
const versionMap: Record<string, string> = {
  'nvi': 'almeida',
  'acf': 'almeida',
  'ra': 'almeida',
  'nvt': 'almeida'
};

// Lista completa de livros da Bíblia
const bibleBooks = [
  { name: 'Gênesis', abbrev: 'gn', chapters: 50, testament: 'old', number: 1 },
  { name: 'Êxodo', abbrev: 'ex', chapters: 40, testament: 'old', number: 2 },
  { name: 'Levítico', abbrev: 'lv', chapters: 27, testament: 'old', number: 3 },
  { name: 'Números', abbrev: 'nm', chapters: 36, testament: 'old', number: 4 },
  { name: 'Deuteronômio', abbrev: 'dt', chapters: 34, testament: 'old', number: 5 },
  { name: 'Josué', abbrev: 'js', chapters: 24, testament: 'old', number: 6 },
  { name: 'Juízes', abbrev: 'jz', chapters: 21, testament: 'old', number: 7 },
  { name: 'Rute', abbrev: 'rt', chapters: 4, testament: 'old', number: 8 },
  { name: '1Samuel', abbrev: '1sm', chapters: 31, testament: 'old', number: 9 },
  { name: '2Samuel', abbrev: '2sm', chapters: 24, testament: 'old', number: 10 },
  { name: '1Reis', abbrev: '1rs', chapters: 22, testament: 'old', number: 11 },
  { name: '2Reis', abbrev: '2rs', chapters: 25, testament: 'old', number: 12 },
  { name: '1Crônicas', abbrev: '1cr', chapters: 29, testament: 'old', number: 13 },
  { name: '2Crônicas', abbrev: '2cr', chapters: 36, testament: 'old', number: 14 },
  { name: 'Esdras', abbrev: 'ed', chapters: 10, testament: 'old', number: 15 },
  { name: 'Neemias', abbrev: 'ne', chapters: 13, testament: 'old', number: 16 },
  { name: 'Ester', abbrev: 'et', chapters: 10, testament: 'old', number: 17 },
  { name: 'Jó', abbrev: 'job', chapters: 42, testament: 'old', number: 18 },
  { name: 'Salmos', abbrev: 'sl', chapters: 150, testament: 'old', number: 19 },
  { name: 'Provérbios', abbrev: 'pv', chapters: 31, testament: 'old', number: 20 },
  { name: 'Eclesiastes', abbrev: 'ec', chapters: 12, testament: 'old', number: 21 },
  { name: 'Cânticos', abbrev: 'ct', chapters: 8, testament: 'old', number: 22 },
  { name: 'Isaías', abbrev: 'is', chapters: 66, testament: 'old', number: 23 },
  { name: 'Jeremias', abbrev: 'jr', chapters: 52, testament: 'old', number: 24 },
  { name: 'Lamentações', abbrev: 'lm', chapters: 5, testament: 'old', number: 25 },
  { name: 'Ezequiel', abbrev: 'ez', chapters: 48, testament: 'old', number: 26 },
  { name: 'Daniel', abbrev: 'dn', chapters: 12, testament: 'old', number: 27 },
  { name: 'Oseias', abbrev: 'os', chapters: 14, testament: 'old', number: 28 },
  { name: 'Joel', abbrev: 'jl', chapters: 3, testament: 'old', number: 29 },
  { name: 'Amós', abbrev: 'am', chapters: 9, testament: 'old', number: 30 },
  { name: 'Obadias', abbrev: 'ob', chapters: 1, testament: 'old', number: 31 },
  { name: 'Jonas', abbrev: 'jn', chapters: 4, testament: 'old', number: 32 },
  { name: 'Miqueias', abbrev: 'mq', chapters: 7, testament: 'old', number: 33 },
  { name: 'Naum', abbrev: 'na', chapters: 3, testament: 'old', number: 34 },
  { name: 'Habacuque', abbrev: 'hc', chapters: 3, testament: 'old', number: 35 },
  { name: 'Sofonias', abbrev: 'sf', chapters: 3, testament: 'old', number: 36 },
  { name: 'Ageu', abbrev: 'ag', chapters: 2, testament: 'old', number: 37 },
  { name: 'Zacarias', abbrev: 'zc', chapters: 14, testament: 'old', number: 38 },
  { name: 'Malaquias', abbrev: 'ml', chapters: 4, testament: 'old', number: 39 },
  { name: 'Mateus', abbrev: 'mt', chapters: 28, testament: 'new', number: 40 },
  { name: 'Marcos', abbrev: 'mc', chapters: 16, testament: 'new', number: 41 },
  { name: 'Lucas', abbrev: 'lc', chapters: 24, testament: 'new', number: 42 },
  { name: 'João', abbrev: 'jo', chapters: 21, testament: 'new', number: 43 },
  { name: 'Atos', abbrev: 'at', chapters: 28, testament: 'new', number: 44 },
  { name: 'Romanos', abbrev: 'rm', chapters: 16, testament: 'new', number: 45 },
  { name: '1Coríntios', abbrev: '1co', chapters: 16, testament: 'new', number: 46 },
  { name: '2Coríntios', abbrev: '2co', chapters: 13, testament: 'new', number: 47 },
  { name: 'Gálatas', abbrev: 'gl', chapters: 6, testament: 'new', number: 48 },
  { name: 'Efésios', abbrev: 'ef', chapters: 6, testament: 'new', number: 49 },
  { name: 'Filipenses', abbrev: 'fp', chapters: 4, testament: 'new', number: 50 },
  { name: 'Colossenses', abbrev: 'cl', chapters: 4, testament: 'new', number: 51 },
  { name: '1Tessalonicenses', abbrev: '1ts', chapters: 5, testament: 'new', number: 52 },
  { name: '2Tessalonicenses', abbrev: '2ts', chapters: 3, testament: 'new', number: 53 },
  { name: '1Timóteo', abbrev: '1tm', chapters: 6, testament: 'new', number: 54 },
  { name: '2Timóteo', abbrev: '2tm', chapters: 4, testament: 'new', number: 55 },
  { name: 'Tito', abbrev: 'tt', chapters: 3, testament: 'new', number: 56 },
  { name: 'Filemom', abbrev: 'fm', chapters: 1, testament: 'new', number: 57 },
  { name: 'Hebreus', abbrev: 'hb', chapters: 13, testament: 'new', number: 58 },
  { name: 'Tiago', abbrev: 'tg', chapters: 5, testament: 'new', number: 59 },
  { name: '1Pedro', abbrev: '1pe', chapters: 5, testament: 'new', number: 60 },
  { name: '2Pedro', abbrev: '2pe', chapters: 3, testament: 'new', number: 61 },
  { name: '1João', abbrev: '1jo', chapters: 5, testament: 'new', number: 62 },
  { name: '2João', abbrev: '2jo', chapters: 1, testament: 'new', number: 63 },
  { name: '3João', abbrev: '3jo', chapters: 1, testament: 'new', number: 64 },
  { name: 'Judas', abbrev: 'jd', chapters: 1, testament: 'new', number: 65 },
  { name: 'Apocalipse', abbrev: 'ap', chapters: 22, testament: 'new', number: 66 }
];

export const bibleService = {
  async getBooks() {
    try {
      // Retorna a lista estática de livros
      return bibleBooks.map(book => ({
        name: book.name,
        abbrev: { pt: book.abbrev },
        chapters: book.chapters,
        testament: book.testament,
        number: book.number
      }));
    } catch (error) {
      console.error('Erro ao buscar livros da Bíblia:', error);
      throw error;
    }
  },

  async getVerses(version: string, bookAbbrev: string, chapter: number) {
    try {
      // Encontrar o número do livro pela abreviação
      const bookInfo = bibleBooks.find(b => b.abbrev === bookAbbrev);
      if (!bookInfo) {
        throw new Error(`Livro não encontrado: ${bookAbbrev}`);
      }
      
      const translationCode = versionMap[version] || 'almeida';
      const url = `${API_BASE_URL}/${translationCode}/${bookInfo.number}/${chapter}.json`;
      
      console.log('🔍 Buscando versículos:', { version, bookAbbrev, bookNumber: bookInfo.number, chapter, translationCode, url });
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ Resposta da API:', response.data ? 'Dados recebidos' : 'Sem dados');
      
      if (response.data && response.data.verses) {
        const verses = Object.values(response.data.verses).map((verse: any) => ({
          number: verse.verse,
          text: verse.text
        }));
        
        console.log('📖 Total de versículos:', verses.length);
        
        return {
          book: { name: response.data.name },
          chapter: { number: chapter },
          verses: verses
        };
      }
      
      console.log('⚠️ Nenhum versículo encontrado na resposta');
      return { verses: [] };
    } catch (error: any) {
      console.error('❌ Erro ao buscar versículos:', {
        version,
        bookAbbrev,
        chapter,
        error: error.message
      });
      throw error;
    }
  }
};
