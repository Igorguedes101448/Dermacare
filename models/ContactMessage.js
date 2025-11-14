const db = require('../config/database');

class ContactMessage {
    // Criar mensagem de contacto
    static async create(messageData) {
        const { name, email, phone, subject, message } = messageData;
        
        const [result] = await db.execute(
            'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, subject, message]
        );
        
        return result.insertId;
    }

    // Listar todas as mensagens
    static async findAll(status = null) {
        let query = 'SELECT * FROM contact_messages';
        const params = [];
        
        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Buscar mensagem por ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM contact_messages WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Atualizar status da mensagem
    static async updateStatus(id, status) {
        const [result] = await db.execute(
            'UPDATE contact_messages SET status = ? WHERE id = ?',
            [status, id]
        );
        
        return result.affectedRows > 0;
    }

    // Excluir mensagem
    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM contact_messages WHERE id = ?',
            [id]
        );
        
        return result.affectedRows > 0;
    }
}

module.exports = ContactMessage;
