import pool from '../config/database';

interface MinistrationData {
  titulo: string;
  ministracao_url: string;
}

const ministrationService = {
  async createMinistration(data: MinistrationData) {
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO "MINISTRACOES" (titulo, ministracao_url, criado_em)
        VALUES ($1, $2, NOW())
        RETURNING id, titulo, ministracao_url, criado_em
      `;
      
      const values = [data.titulo, data.ministracao_url];
      const result = await client.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar ministração:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  async getMinistrations() {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id, titulo, ministracao_url, criado_em FROM "MINISTRACOES" 
        ORDER BY criado_em DESC
      `;
      
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar ministrações:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  async getMinistrationById(id: number) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT id, titulo, ministracao_url, criado_em FROM "MINISTRACOES" 
        WHERE id = $1
      `;
      
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao buscar ministração por ID:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  async deleteMinistration(id: number) {
    const client = await pool.connect();
    try {
      const query = `
        DELETE FROM "MINISTRACOES" 
        WHERE id = $1
        RETURNING id, titulo, ministracao_url, criado_em
      `;
      
      const result = await client.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao deletar ministração:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};

export default ministrationService;