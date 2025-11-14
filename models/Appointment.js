const db = require('../config/database');

class Appointment {
    // Criar marcação
    static async create(appointmentData) {
        const { patient_id, doctor_id, service_id, appointment_date, appointment_time, notes } = appointmentData;
        
        const [result] = await db.execute(
            `INSERT INTO appointments 
            (patient_id, doctor_id, service_id, appointment_date, appointment_time, notes, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [patient_id, doctor_id, service_id, appointment_date, appointment_time, notes]
        );
        
        return result.insertId;
    }

    // Buscar marcação por ID
    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT a.*, 
                    p.name as patient_name, p.email as patient_email, p.phone as patient_phone,
                    d.name as doctor_name, d.specialty as doctor_specialty,
                    s.name as service_name, s.price as service_price
             FROM appointments a
             LEFT JOIN users p ON a.patient_id = p.id
             LEFT JOIN users d ON a.doctor_id = d.id
             LEFT JOIN services s ON a.service_id = s.id
             WHERE a.id = ?`,
            [id]
        );
        return rows[0];
    }

    // Listar marcações
    static async findAll(filters = {}) {
        let query = `
            SELECT a.*, 
                   p.name as patient_name, p.email as patient_email,
                   d.name as doctor_name, d.specialty as doctor_specialty,
                   s.name as service_name
            FROM appointments a
            LEFT JOIN users p ON a.patient_id = p.id
            LEFT JOIN users d ON a.doctor_id = d.id
            LEFT JOIN services s ON a.service_id = s.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (filters.patient_id) {
            query += ' AND a.patient_id = ?';
            params.push(filters.patient_id);
        }
        
        if (filters.doctor_id) {
            query += ' AND a.doctor_id = ?';
            params.push(filters.doctor_id);
        }
        
        if (filters.status) {
            query += ' AND a.status = ?';
            params.push(filters.status);
        }
        
        if (filters.date) {
            query += ' AND a.appointment_date = ?';
            params.push(filters.date);
        }
        
        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Atualizar status da marcação
    static async updateStatus(id, status) {
        const [result] = await db.execute(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, id]
        );
        
        return result.affectedRows > 0;
    }

    // Atualizar marcação
    static async update(id, appointmentData) {
        const { doctor_id, service_id, appointment_date, appointment_time, notes, status } = appointmentData;
        
        const [result] = await db.execute(
            `UPDATE appointments 
             SET doctor_id = ?, service_id = ?, appointment_date = ?, 
                 appointment_time = ?, notes = ?, status = ?
             WHERE id = ?`,
            [doctor_id, service_id, appointment_date, appointment_time, notes, status, id]
        );
        
        return result.affectedRows > 0;
    }

    // Excluir marcação
    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM appointments WHERE id = ?',
            [id]
        );
        
        return result.affectedRows > 0;
    }

    // Verificar disponibilidade
    static async checkAvailability(doctor_id, appointment_date, appointment_time, excludeId = null) {
        let query = `
            SELECT COUNT(*) as count 
            FROM appointments 
            WHERE doctor_id = ? 
            AND appointment_date = ? 
            AND appointment_time = ? 
            AND status != 'cancelled'
        `;
        
        const params = [doctor_id, appointment_date, appointment_time];
        
        if (excludeId) {
            query += ' AND id != ?';
            params.push(excludeId);
        }
        
        const [rows] = await db.execute(query, params);
        return rows[0].count === 0;
    }

    // Obter estatísticas
    static async getStats() {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
            FROM appointments
        `);
        return rows[0];
    }
}

module.exports = Appointment;
