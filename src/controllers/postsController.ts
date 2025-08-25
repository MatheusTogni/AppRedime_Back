import { Request, Response } from 'express';
import postsService from '../services/postsService';

const postsController = {
    async getPosts(req: Request, res: Response) {
        try {
            const posts = await postsService.getPosts();
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
}

export default postsController;
