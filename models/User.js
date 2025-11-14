const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Criar utilizador
    static async create(userData) {
        const { name, email, password, phone, role, specialty } = userData;
        
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, phone, role, specialty) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, role || 'patient', specialty]
        );
        
        return result.insertId;
    }

    // Buscar utilizador por email
    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Buscar utilizador por ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, name, email, phone, role, specialty, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Listar todos os utilizadores
    static async findAll(role = null) {
        let query = 'SELECT id, name, email, phone, role, specialty, created_at FROM users';
        let params = [];
        
        if (role) {
            query += ' WHERE role = ?';
            params.push(role);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Listar médicos
    static async findDoctors() {
        const [rows] = await db.execute(
            'SELECT id, name, email, phone, specialty FROM users WHERE role = "doctor" ORDER BY name',
            []
        );
        return rows;
    }

    // Atualizar utilizador
    static async update(id, userData) {
        const { name, email, phone, specialty } = userData;
        
        const [result] = await db.execute(
            'UPDATE users SET name = ?, email = ?, phone = ?, specialty = ? WHERE id = ?',
            [name, email, phone, specialty, id]
        );
        
        return result.affectedRows > 0;
    }

    // Excluir utilizador
    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        
        return result.affectedRows > 0;
    }

    // Verificar senha
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = User;
