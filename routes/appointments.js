const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Criar marcação
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { doctor_id, service_id, appointment_date, appointment_time, notes } = req.body;
        const patient_id = req.user.role === 'patient' ? req.user.id : req.body.patient_id;

        // Verificar disponibilidade
        const isAvailable = await Appointment.checkAvailability(
            doctor_id, 
            appointment_date, 
            appointment_time
        );

        if (!isAvailable) {
            return res.status(400).json({ 
                success: false, 
                message: 'Este horário já está ocupado. Por favor, escolha outro horário.' 
            });
        }

        // Criar marcação
        const appointmentId = await Appointment.create({
            patient_id,
            doctor_id,
            service_id,
            appointment_date,
            appointment_time,
            notes
        });

        res.status(201).json({ 
            success: true, 
            message: 'Marcação criada com sucesso!',
            appointmentId 
        });
    } catch (error) {
        console.error('Erro ao criar marcação:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao criar marcação.' 
        });
    }
});

// Listar marcações
router.get('/', authMiddleware, async (req, res) => {
    try {
        const filters = {};

        // Filtrar por papel do utilizador
        if (req.user.role === 'patient') {
            filters.patient_id = req.user.id;
        } else if (req.user.role === 'doctor') {
            filters.doctor_id = req.user.id;
        }

        // Filtros adicionais
        if (req.query.status) filters.status = req.query.status;
        if (req.query.date) filters.date = req.query.date;
        if (req.query.patient_id && req.user.role === 'admin') {
            filters.patient_id = req.query.patient_id;
        }
        if (req.query.doctor_id && req.user.role === 'admin') {
            filters.doctor_id = req.query.doctor_id;
        }

        const appointments = await Appointment.findAll(filters);
        
        res.json({ 
            success: true, 
            appointments 
        });
    } catch (error) {
        console.error('Erro ao listar marcações:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao listar marcações.' 
        });
    }
});

// Obter marcação por ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Marcação não encontrada.' 
            });
        }

        // Verificar permissões
        if (req.user.role === 'patient' && appointment.patient_id !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Sem permissão para ver esta marcação.' 
            });
        }

        if (req.user.role === 'doctor' && appointment.doctor_id !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Sem permissão para ver esta marcação.' 
            });
        }
        
        res.json({ 
            success: true, 
            appointment 
        });
    } catch (error) {
        console.error('Erro ao obter marcação:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao obter marcação.' 
        });
    }
});

// Atualizar marcação
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Marcação não encontrada.' 
            });
        }

        // Verificar permissões
        if (req.user.role === 'patient' && appointment.patient_id !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Sem permissão para atualizar esta marcação.' 
            });
        }

        // Verificar disponibilidade se mudar horário
        if (req.body.appointment_date || req.body.appointment_time) {
            const isAvailable = await Appointment.checkAvailability(
                req.body.doctor_id || appointment.doctor_id,
                req.body.appointment_date || appointment.appointment_date,
                req.body.appointment_time || appointment.appointment_time,
                req.params.id
            );

            if (!isAvailable) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Este horário já está ocupado.' 
                });
            }
        }

        const updated = await Appointment.update(req.params.id, {
            doctor_id: req.body.doctor_id || appointment.doctor_id,
            service_id: req.body.service_id || appointment.service_id,
            appointment_date: req.body.appointment_date || appointment.appointment_date,
            appointment_time: req.body.appointment_time || appointment.appointment_time,
            notes: req.body.notes || appointment.notes,
            status: req.body.status || appointment.status
        });
        
        res.json({ 
            success: true, 
            message: 'Marcação atualizada com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao atualizar marcação:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao atualizar marcação.' 
        });
    }
});

// Cancelar marcação
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Marcação não encontrada.' 
            });
        }

        // Verificar permissões
        if (req.user.role === 'patient' && appointment.patient_id !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Sem permissão para cancelar esta marcação.' 
            });
        }

        await Appointment.updateStatus(req.params.id, 'cancelled');
        
        res.json({ 
            success: true, 
            message: 'Marcação cancelada com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao cancelar marcação:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao cancelar marcação.' 
        });
    }
});

// Confirmar marcação (médico ou admin)
router.patch('/:id/confirm', authMiddleware, roleMiddleware('doctor', 'admin'), async (req, res) => {
    try {
        await Appointment.updateStatus(req.params.id, 'confirmed');
        
        res.json({ 
            success: true, 
            message: 'Marcação confirmada com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao confirmar marcação:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao confirmar marcação.' 
        });
    }
});

// Completar marcação (médico ou admin)
router.patch('/:id/complete', authMiddleware, roleMiddleware('doctor', 'admin'), async (req, res) => {
    try {
        await Appointment.updateStatus(req.params.id, 'completed');
        
        res.json({ 
            success: true, 
            message: 'Marcação completada com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao completar marcação:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao completar marcação.' 
        });
    }
});

// Excluir marcação (apenas admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
    try {
        const deleted = await Appointment.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ 
                success: false, 
                message: 'Marcação não encontrada.' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Marcação excluída com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao excluir marcação:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao excluir marcação.' 
        });
    }
});

// Obter estatísticas (admin e médicos)
router.get('/stats/overview', authMiddleware, roleMiddleware('admin', 'doctor'), async (req, res) => {
    try {
        const stats = await Appointment.getStats();
        
        res.json({ 
            success: true, 
            stats 
        });
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao obter estatísticas.' 
        });
    }
});

// Listar serviços (público)
router.get('/services/all', async (req, res) => {
    try {
        const services = await Service.findAll();
        
        res.json({ 
            success: true, 
            services 
        });
    } catch (error) {
        console.error('Erro ao listar serviços:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao listar serviços.' 
        });
    }
});

module.exports = router;
