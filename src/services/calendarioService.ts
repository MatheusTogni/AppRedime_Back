import { Pool } from 'pg';
import pool from '../config/database';

interface EventoData {
    titulo: string;
    descricao?: string;
    data_evento: string;
    cor?: string;
}

interface EventoFilters {
    mes?: number;
    ano?: number;
}

class CalendarioService {
    private db: Pool;

    constructor() {
        this.db = pool;
    }

    async createEvento(data: EventoData) {
        const query = `
      INSERT INTO "CALENDARIO" (titulo, descricao, data_evento, cor)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

        const values = [data.titulo, data.descricao, data.data_evento, data.cor];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async getEventos(filters: EventoFilters = {}) {
        let query = `
      SELECT id, titulo, descricao, TO_CHAR(data_evento, 'DD/MM/YYYY') AS data_evento, cor
      FROM "CALENDARIO"
    `;
        const values: any[] = [];
        const conditions: string[] = [];

        if (filters.mes && filters.ano) {
            conditions.push(`EXTRACT(MONTH FROM data_evento) = $${values.length + 1}`);
            values.push(filters.mes);

            conditions.push(`EXTRACT(YEAR FROM data_evento) = $${values.length + 1}`);
            values.push(filters.ano);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY data_evento ASC`;

        const result = await this.db.query(query, values);
        console.log('resultado', result)
        return result.rows;
    }

    async updateEvento(id: number, data: EventoData) {
        const query = `
      UPDATE "CALENDARIO" 
      SET titulo = $1, descricao = $2, data_evento = $3, cor = $4
      WHERE id = $5
      RETURNING *
    `;

        const values = [data.titulo, data.descricao, data.data_evento, data.cor, id];
        const result = await this.db.query(query, values);
        return result.rows[0];
    }

    async deleteEvento(id: number) {
        const query = `
      DELETE FROM "CALENDARIO" 
      WHERE id = $1
      RETURNING *
    `;

        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }

    async getEventoById(id: number) {
        const query = `
      SELECT id, titulo, descricao, TO_CHAR(data_evento, 'DD/MM/YYYY') AS data_evento, cor FROM "CALENDARIO" 
      WHERE id = $1
    `;

        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }
}

export default new CalendarioService();