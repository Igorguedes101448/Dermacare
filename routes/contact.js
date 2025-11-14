const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Enviar mensagem de contacto (público)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validação básica
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor, preencha todos os campos obrigatórios.' 
            });
        }

        const messageId = await ContactMessage.create({
            name,
            email,
            phone,
            subject,
            message
        });

        res.status(201).json({ 
            success: true, 
            message: 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.',
            messageId 
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao enviar mensagem.' 
        });
    }
});

// Listar mensagens (apenas admin)
router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const { status } = req.query;
        const messages = await ContactMessage.findAll(status);
        
        res.json({ 
            success: true, 
            messages 
        });
    } catch (error) {
        console.error('Erro ao listar mensagens:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao listar mensagens.' 
        });
    }
});

// Obter mensagem por ID (apenas admin)
router.get('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({ 
                success: false, 
                message: 'Mensagem não encontrada.' 
            });
        }

        // Marcar como lida
        await ContactMessage.updateStatus(req.params.id, 'read');
        
        res.json({ 
            success: true, 
            message 
        });
    } catch (error) {
        console.error('Erro ao obter mensagem:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao obter mensagem.' 
        });
    }
});

// Atualizar status da mensagem (apenas admin)
router.patch('/:id/status', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['new', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Status inválido.' 
            });
        }

        await ContactMessage.updateStatus(req.params.id, status);
        
        res.json({ 
            success: true, 
            message: 'Status atualizado com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar status.' 
        });
    }
});

// Excluir mensagem (apenas admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const deleted = await ContactMessage.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false, 
                message: 'Mensagem não encontrada.' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Mensagem excluída com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao excluir mensagem:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao excluir mensagem.' 
        });
    }
});

module.exports = router;
