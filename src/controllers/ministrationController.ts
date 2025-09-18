import { Request, Response } from 'express';
import ministrationService from '../services/ministrationService';
import path from 'path';
import fs from 'fs';

const ministrationController = {
    async getMinistrations(req: Request, res: Response) {
        try {
            const ministrations = await ministrationService.getMinistrations();
            res.status(200).json({
                ministrations: ministrations,
                total: ministrations.length
            });
        } catch (error) {
            console.error('Erro ao buscar ministrações:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    async createMinistration(req: Request, res: Response) {
        try {
            const { titulo } = req.body;

            if (!titulo) {
                return res.status(400).json({
                    success: false,
                    message: 'Título é obrigatório'
                });
            }

            // Verifica se foi enviado um arquivo
            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhum arquivo foi enviado'
                });
            }

            // Pega o primeiro arquivo (assumindo que só vai enviar um PDF por vez)
            const file = req.files[0];
            const ministracaoUrl = `/uploads/posts/${file.filename}`;

            const ministrationData = {
                titulo,
                ministracao_url: ministracaoUrl
            };
            
            const result = await ministrationService.createMinistration(ministrationData);
            
            res.status(201).json({ 
                success: true, 
                ministration: result,
                message: 'Ministração criada com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao criar ministração:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    async getMinistrationById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const ministration = await ministrationService.getMinistrationById(Number(id));
            
            if (!ministration) {
                return res.status(404).json({
                    success: false,
                    message: 'Ministração não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                ministration
            });
        } catch (error) {
            console.error('Erro ao buscar ministração:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    async deleteMinistration(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedMinistration = await ministrationService.deleteMinistration(Number(id));
            
            if (!deletedMinistration) {
                return res.status(404).json({
                    success: false,
                    message: 'Ministração não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Ministração deletada com sucesso!',
                ministration: deletedMinistration
            });
        } catch (error) {
            console.error('Erro ao deletar ministração:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    },

    async downloadMinistration(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const ministration = await ministrationService.getMinistrationById(Number(id));
            
            if (!ministration) {
                return res.status(404).json({
                    success: false,
                    message: 'Ministração não encontrada'
                });
            }

            // Constrói o caminho completo do arquivo
            const filePath = path.join(__dirname, '../../uploads/posts', path.basename(ministration.ministracao_url));
            
            // Verifica se o arquivo existe
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Arquivo não encontrado no servidor'
                });
            }

            // Define o nome do arquivo para download
            const fileName = `${ministration.titulo}.pdf`;
            
            // Configura os headers para forçar download
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/pdf');
            
            // Envia o arquivo
            res.sendFile(filePath);
        } catch (error) {
            console.error('Erro ao fazer download da ministração:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor' 
            });
        }
    }
};

export default ministrationController;