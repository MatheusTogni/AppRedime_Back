import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuração do armazenamento para ministrações
const ministrationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/posts');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `ministration-${uniqueSuffix}${extension}`);
  }
});

// Filtro para aceitar PDFs e imagens
const ministrationFileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/gif'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos PDF e imagens são permitidos'), false);
  }
};

// Configuração do multer para ministrações
const ministrationUpload = multer({
  storage: ministrationStorage,
  fileFilter: ministrationFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo para PDFs
    files: 5 // máximo 5 arquivos por vez
  }
});

export default ministrationUpload;