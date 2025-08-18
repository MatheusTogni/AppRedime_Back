import bcrypt from 'bcryptjs';

/**
 * Utilitário para gerar hashes de senha
 * Use: npm run hash-password
 */

async function hashPassword(password: string): Promise<void> {
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('\n=== Gerador de Hash de Senha ===');
  console.log(`Senha original: ${password}`);
  console.log(`Hash gerado: ${hash}`);
  console.log('\nUse este hash no banco de dados.\n');
}

// Pegar a senha dos argumentos da linha de comando
const password = process.argv[2];

if (!password) {
  console.log('\n❌ Uso: npm run hash-password <sua_senha>');
  console.log('Exemplo: npm run hash-password 123456\n');
  process.exit(1);
}

hashPassword(password).catch(console.error);
