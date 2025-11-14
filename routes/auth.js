const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registar novo utilizador
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Verificar se o utilizador já existe
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Este email já está registado.' 
            });
        }

        // Criar novo utilizador
        const userId = await User.create({ name, email, password, phone, role });

        res.status(201).json({ 
            success: true, 
            message: 'Utilizador registado com sucesso!',
            userId 
        });
    } catch (error) {
        console.error('Erro ao registar:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao registar utilizador.' 
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar utilizador
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou senha incorretos.' 
            });
        }

        // Verificar senha
        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Email ou senha incorretos.' 
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({ 
            success: true, 
            message: 'Login efetuado com sucesso!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                specialty: user.specialty
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao fazer login.' 
        });
    }
});

// Verificar token
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token não fornecido.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Utilizador não encontrado.' 
            });
        }

        res.json({ 
            success: true, 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                specialty: user.specialty
            }
        });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Token inválido.' 
        });
    }
});

module.exports = router;
