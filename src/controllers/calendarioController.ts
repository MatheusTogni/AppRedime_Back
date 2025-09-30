import { Request, Response } from 'express';
import calendarioService from '../services/calendarioService';

class CalendarioController {
    async createEvento(req: Request, res: Response): Promise<void> {
        try {
            const { titulo, descricao, data_evento, cor } = req.body;

            if (!titulo || !data_evento) {
                res.status(400).json({
                    success: false,
                    message: 'Título e data do evento são obrigatórios'
                });
                return;
            }

            const evento = await calendarioService.createEvento({
                titulo,
                descricao,
                data_evento,
                cor: cor || '#1976d2'
            });

            res.status(201).json({
                success: true,
                message: 'Evento criado com sucesso',
                evento
            });
        } catch (error) {
            console.error('Erro ao criar evento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    // async getEventos(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { mes, ano } = req.query;

    //         let filters: any = {};

    //         if (mes && ano) {
    //             filters.mes = parseInt(mes as string);
    //             filters.ano = parseInt(ano as string);
    //         }

    //         const eventos = await calendarioService.getEventos(filters);

    //         res.status(200).json({
    //             success: true,
    //             eventos
    //         });
    //     } catch (error) {
    //         console.error('Erro ao buscar eventos:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: 'Erro interno do servidor'
    //         });
    //     }
    // }

    async updateEvento(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { titulo, descricao, data_evento, cor } = req.body;

            if (!titulo || !data_evento) {
                res.status(400).json({
                    success: false,
                    message: 'Título e data do evento são obrigatórios'
                });
                return;
            }

            const evento = await calendarioService.updateEvento(parseInt(id), {
                titulo,
                descricao,
                data_evento,
                cor
            });

            if (!evento) {
                res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Evento atualizado com sucesso',
                evento
            });
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }

    async deleteEvento(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const deletado = await calendarioService.deleteEvento(parseInt(id));

            if (!deletado) {
                res.status(404).json({
                    success: false,
                    message: 'Evento não encontrado'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Evento excluído com sucesso'
            });
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

export default new CalendarioController();