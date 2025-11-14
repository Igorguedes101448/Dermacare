const db = require('../config/database');

class Service {
    // Listar todos os serviços
    static async findAll() {
        const [rows] = await db.execute(
            'SELECT * FROM services ORDER BY name'
        );
        return rows;
    }

    // Buscar serviço por ID
    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM services WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Criar serviço
    static async create(serviceData) {
        const { name, description, duration, price } = serviceData;
        
        const [result] = await db.execute(
            'INSERT INTO services (name, description, duration, price) VALUES (?, ?, ?, ?)',
            [name, description, duration, price]
        );
        
        return result.insertId;
    }

    // Atualizar serviço
    static async update(id, serviceData) {
        const { name, description, duration, price } = serviceData;
        
        const [result] = await db.execute(
            'UPDATE services SET name = ?, description = ?, duration = ?, price = ? WHERE id = ?',
            [name, description, duration, price, id]
        );
        
        return result.affectedRows > 0;
    }

    // Excluir serviço
    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM services WHERE id = ?',
            [id]
        );
        
        return result.affectedRows > 0;
    }
}

module.exports = Service;
