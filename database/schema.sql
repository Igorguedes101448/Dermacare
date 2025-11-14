-- Criar base de dados
CREATE DATABASE IF NOT EXISTS clinica_dermacare;
USE clinica_dermacare;

-- Tabela de utilizadores
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'doctor', 'patient') DEFAULT 'patient',
    specialty VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de serviços
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INT DEFAULT 30,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de marcações
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    service_id INT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Tabela de mensagens de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir utilizadores padrão (senha: admin123, medico123, paciente123)
-- Nota: As senhas devem ser hash bcrypt em produção
INSERT INTO users (name, email, password, phone, role, specialty) VALUES
('Administrador', 'admin@dermacare.pt', '$2a$10$xQVKxGVqZ5vxJ5jZp5YZP.VXqQZxGVqZ5vxJ5jZp5YZP.VXqQZxG', '912345678', 'admin', NULL),
('Dr. João Silva', 'medico@dermacare.pt', '$2a$10$xQVKxGVqZ5vxJ5jZp5YZP.VXqQZxGVqZ5vxJ5jZp5YZP.VXqQZxG', '912345679', 'doctor', 'Dermatologia Geral'),
('Maria Santos', 'paciente@dermacare.pt', '$2a$10$xQVKxGVqZ5vxJ5jZp5YZP.VXqQZxGVqZ5vxJ5jZp5YZP.VXqQZxG', '912345680', 'patient', NULL);

-- Inserir serviços dermatológicos
INSERT INTO services (name, description, duration, price) VALUES
('Consulta Dermatológica', 'Consulta de avaliação e diagnóstico dermatológico completo', 30, 60.00),
('Tratamento de Acne', 'Tratamento especializado para acne e suas sequelas', 45, 80.00),
('Remoção de Sinais', 'Remoção cirúrgica de sinais e lesões cutâneas', 30, 120.00),
('Peeling Químico', 'Tratamento para renovação celular e rejuvenescimento', 60, 150.00),
('Laser Dermatológico', 'Tratamentos a laser para diversas condições de pele', 45, 200.00),
('Tratamento Capilar', 'Diagnóstico e tratamento de problemas capilares', 40, 90.00);

-- Criar índices para melhor performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
