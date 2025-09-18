import pool from '../config/database';

interface PostData {
    titulo: string;
    descricao: string;
    images: string[];
    userId?: number;
}

const postsService = {
    async createPost(params: PostData) {

        try {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                const postQuery = `
                    INSERT INTO "POSTS" (titulo, descricao, criado_em) 
                    VALUES ($1, $2, NOW()) 
                    RETURNING id, titulo, descricao, criado_em
                `;

                const postResult = await client.query(postQuery, [
                    params.titulo,
                    params.descricao
                ]);

                const post = postResult.rows[0];

                if (params.images && params.images.length > 0) {
                    const imageInserts = params.images.map(async (imageUrl) => {
                        const imageQuery = `
                            INSERT INTO "IMAGESXPOSTS" (id_post, imagem_url) 
                            VALUES ($1, $2)
                        `;
                        return client.query(imageQuery, [post.id, imageUrl]);
                    });

                    await Promise.all(imageInserts);
                }

                await client.query('COMMIT');

                return {
                    id: post.id,
                    titulo: post.titulo,
                    descricao: post.descricao,
                    criado_em: post.criado_em,
                    images: params.images || []
                };

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }

        } catch (error) {
            console.error('Erro ao criar post:', error);
            throw new Error('Erro ao criar post no banco de dados');
        }
    },

    async getPosts() {
        try {
            const client = await pool.connect();

            try {
                const query = `
                    SELECT 
                        p.id,
                        p.titulo,
                        p.descricao as descricao,
                        p.criado_em,
                        COALESCE(
                            json_agg(
                                CASE 
                                    WHEN i.imagem_url IS NOT NULL 
                                    THEN i.imagem_url 
                                    ELSE NULL 
                                END
                            ) FILTER (WHERE i.imagem_url IS NOT NULL), 
                            '[]'::json
                        ) as images
                    FROM "POSTS" p
                    LEFT JOIN "IMAGESXPOSTS" i ON p.id = i.id_post
                    GROUP BY p.id, p.titulo, p.descricao, p.criado_em
                    ORDER BY p.criado_em DESC
                `;

                const result = await client.query(query);
                return result.rows;

            } finally {
                client.release();
            }

        } catch (error) {
            console.error('Erro ao buscar posts:', error);
            throw new Error('Erro ao buscar posts do banco de dados');
        }
    },

    async deletePost(id: number) {
        try {
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                // Primeiro, deleta as imagens associadas
                const deleteImagesQuery = `
                    DELETE FROM "IMAGESXPOSTS" 
                    WHERE id_post = $1
                `;
                await client.query(deleteImagesQuery, [id]);

                // Depois, deleta o post
                const deletePostQuery = `
                    DELETE FROM "POSTS" 
                    WHERE id = $1
                    RETURNING id, titulo, descricao, criado_em
                `;
                const result = await client.query(deletePostQuery, [id]);

                await client.query('COMMIT');
                return result.rows[0];

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }

        } catch (error) {
            console.error('Erro ao deletar post:', error);
            throw new Error('Erro ao deletar post do banco de dados');
        }
    }
}

export default postsService