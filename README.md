# 🏥 Sistema Web - Clínica DermaCare

Sistema completo de gestão para clínica dermatológica desenvolvido com tecnologias modernas.

## ✨ Características Principais

### 🎨 Frontend (Público)
- **Página Inicial**: Apresentação profissional da clínica
- **Serviços**: Catálogo completo de tratamentos dermatológicos
- **Marcação de Consultas**: Sistema intuitivo de agendamento
- **Contacto**: Formulário de contacto com validação
- **Design Responsivo**: Totalmente adaptado para mobile e desktop

### 🔐 Sistema de Autenticação
- Login e registo de utilizadores
- Autenticação segura com JWT (JSON Web Tokens)
- Proteção de rotas e dados sensíveis
- Três níveis de acesso: Admin, Médico e Paciente

### 📊 Dashboard Administrativo
- **Visão Geral**: Estatísticas e KPIs em tempo real
- **Gestão de Consultas**: CRUD completo de marcações
- **Gestão de Pacientes**: Lista e detalhes de pacientes
- **Mensagens**: Sistema de gestão de contactos
- **Controlo de Acesso**: Permissões baseadas em roles

### 🔌 API RESTful
- Endpoints completos para todas as funcionalidades
- Validação de dados
- Tratamento de erros robusto
- Documentação clara

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** v14+
- **Express.js** - Framework web
- **MySQL** - Base de dados relacional
- **bcryptjs** - Encriptação de senhas
- **jsonwebtoken** - Autenticação JWT
- **dotenv** - Gestão de variáveis de ambiente

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno e responsivo
- **JavaScript (Vanilla)** - Interatividade e consumo de API
- **Fetch API** - Comunicação com backend

## � Como Começar

### 1. Pré-requisitos

- **Node.js** 14+ ([Download](https://nodejs.org/))
- **WAMP/XAMPP** com MySQL ([Download WAMP](https://www.wampserver.com/))
- Editor de código (VS Code recomendado)

### 2. Instalação Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
# O arquivo .env já está configurado para WAMP padrão

# 3. Importar base de dados
# Via phpMyAdmin: importar database/schema.sql
# Ou usar o MySQL: mysql -u root -p < database/schema.sql

# 4. Iniciar servidor
npm start
# ou com auto-reload:
npm run dev

# Alternativamente no Windows:
# Duplo clique em iniciar.bat
```

### 3. Acessar Aplicação

- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard.html
- **API**: http://localhost:3000/api

## 👥 Utilizadores Padrão

| Email | Senha | Tipo | Permissões |
|-------|-------|------|------------|
| admin@dermacare.pt | admin123 | Admin | Acesso total |
| medico@dermacare.pt | medico123 | Médico | Gestão de consultas |
| paciente@dermacare.pt | paciente123 | Paciente | Marcação de consultas |

## � Funcionalidades Detalhadas

### Para Visitantes (Não autenticados)
- ✅ Visualizar informações da clínica
- ✅ Consultar serviços e preços
- ✅ Enviar mensagem de contacto
- ✅ Registar nova conta

### Para Pacientes
- ✅ Login/Registo
- ✅ Marcar consultas
- ✅ Ver histórico de consultas
- ✅ Cancelar consultas pendentes
- ✅ Editar perfil

### Para Médicos
- ✅ Ver agenda de consultas
- ✅ Confirmar consultas pendentes
- ✅ Completar consultas realizadas
- ✅ Ver informações dos pacientes

### Para Administradores
- ✅ Visão geral com estatísticas
- ✅ Gestão completa de utilizadores
- ✅ Gestão completa de consultas
- ✅ Gestão de serviços
- ✅ Ver e responder mensagens
- ✅ Acesso a relatórios

## 📁 Estrutura do Projeto

```
clinica/
├── config/         # Configurações (DB, JWT)
├── middleware/     # Middleware (autenticação)
├── models/         # Modelos da base de dados
├── routes/         # Rotas da API
├── public/         # Frontend (HTML, CSS, JS)
│   ├── css/
│   ├── js/
│   └── *.html
├── database/       # Schema SQL
└── server.js       # Entrada da aplicação
```

## 📡 API Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registar utilizador
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

### Utilizadores
- `GET /api/users/doctors` - Listar médicos
- `GET /api/users/profile` - Perfil do utilizador

### Consultas
- `POST /api/appointments` - Criar marcação
- `GET /api/appointments` - Listar marcações
- `PATCH /api/appointments/:id/confirm` - Confirmar
- `PATCH /api/appointments/:id/cancel` - Cancelar

### Contacto
- `POST /api/contact` - Enviar mensagem

📖 **Documentação Completa**: Veja `INSTALACAO.md` para guia detalhado

## � Segurança

- ✅ Senhas encriptadas com bcrypt
- ✅ Autenticação JWT com expiração
- ✅ Proteção de rotas sensíveis
- ✅ Validação de dados no backend
- ✅ SQL Injection protection

## 📱 Responsividade

Sistema totalmente responsivo para:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## �📄 Licença

Este projeto foi desenvolvido para a Clínica DermaCare.

---

**© 2025 Clínica DermaCare - Todos os direitos reservados**
