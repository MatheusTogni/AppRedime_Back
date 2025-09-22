import { Request, Response } from 'express';
import postsService from '../services/postsService';

const postsController = {
    async getPosts(req: Request, res: Response) {
        try {
            const { dataInicio, dataFim } = req.query;

            const filters = {
                dataInicio: dataInicio as string,
                dataFim: dataFim as string
            };

            const posts = await postsService.getPosts(filters);
            res.status(200).json({
                posts: posts,
                total: posts.length
            });
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    async createPost(req: Request, res: Response) {
        try {
            const imageUrls: string[] = [];

            if (req.files) {
                if (Array.isArray(req.files)) {
                    for (const file of req.files) {
                        const imageUrl = `/uploads/posts/${file.filename}`;
                        imageUrls.push(imageUrl);
                    }
                }
            }

            const postData = {
                ...req.body,
                images: imageUrls
            };

            const result = await postsService.createPost(postData);
            res.status(200).json({
                success: true,
                post: result,
                imagesUploaded: imageUrls.length
            });
        } catch (error) {
            console.error('Erro ao criar post:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    async deletePost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedPost = await postsService.deletePost(Number(id));

            if (!deletedPost) {
                return res.status(404).json({
                    success: false,
                    message: 'Post não encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post deletado com sucesso!',
                post: deletedPost
            });
        } catch (error) {
            console.error('Erro ao deletar post:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },
}

export default postsController;
