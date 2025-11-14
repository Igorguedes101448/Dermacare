const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Listar todos os utilizadores (apenas admin)
router.get('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const { role } = req.query;
        const users = await User.findAll(role);
        
        res.json({ 
            success: true, 
            users 
        });
    } catch (error) {
        console.error('Erro ao listar utilizadores:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao listar utilizadores.' 
        });
    }
});

// Listar médicos (público)
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.findDoctors();
        
        res.json({ 
            success: true, 
            doctors 
        });
    } catch (error) {
        console.error('Erro ao listar médicos:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao listar médicos.' 
        });
    }
});

// Obter perfil do utilizador autenticado
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Utilizador não encontrado.' 
            });
        }
        
        res.json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error('Erro ao obter perfil:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao obter perfil.' 
        });
    }
});

// Obter utilizador por ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Utilizador não encontrado.' 
            });
        }
        
        res.json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error('Erro ao obter utilizador:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao obter utilizador.' 
        });
    }
});

// Atualizar utilizador
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // Utilizador só pode atualizar seu próprio perfil, exceto se for admin
        if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Sem permissão para atualizar este utilizador.' 
            });
        }

        const updated = await User.update(req.params.id, req.body);
        
        if (!updated) {
            return res.status(404).json({ 
                success: false, 
                message: 'Utilizador não encontrado.' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Utilizador atualizado com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao atualizar utilizador:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar utilizador.' 
        });
    }
});

// Excluir utilizador (apenas admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const deleted = await User.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false, 
                message: 'Utilizador não encontrado.' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Utilizador excluído com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao excluir utilizador:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao excluir utilizador.' 
        });
    }
});

module.exports = router;
