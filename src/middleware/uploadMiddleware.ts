import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Caminho para a pasta public/uploads/posts do frontend
    const uploadPath = path.join(__dirname, '../../../Front/public/uploads/posts');
    
    // Verifica se a pasta existe, se não, cria
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gera um nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `post-${uniqueSuffix}${extension}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos (JPEG, JPG, PNG, GIF)'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 10 // máximo 10 arquivos por vez
  }
});

export default upload;
