# 🏥 Guia de Instalação - Clínica DermaCare

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 14 ou superior)
   - Download: https://nodejs.org/

2. **WAMP Server** (ou XAMPP)
   - Download: https://www.wampserver.com/
   - Certifique-se de que o MySQL está a correr

3. **Editor de Código** (recomendado: VS Code)
   - Download: https://code.visualstudio.com/

## 🚀 Passo a Passo

### 1️⃣ Instalar Dependências

Abra o PowerShell na pasta do projeto e execute:

```powershell
npm install
```

Isto irá instalar todas as dependências necessárias (Express, MySQL2, bcrypt, JWT, etc.)

### 2️⃣ Configurar a Base de Dados

#### Opção A: Via phpMyAdmin (Recomendado)

1. Inicie o WAMP Server
2. Aceda a http://localhost/phpmyadmin
3. Clique em "Importar"
4. Selecione o arquivo `database/schema.sql`
5. Clique em "Executar"

#### Opção B: Via Linha de Comando

```powershell
# Certifique-se de que o MySQL está no PATH
mysql -u root -p < database/schema.sql
```

### 3️⃣ Verificar Configurações

O arquivo `.env` já está configurado com as definições padrão do WAMP:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=clinica_dermacare
```

Se o seu MySQL tiver senha, edite o arquivo `.env` e adicione a senha em `DB_PASSWORD`.

### 4️⃣ Iniciar o Servidor

Para iniciar o servidor em modo de desenvolvimento:

```powershell
npm run dev
```

Ou em modo de produção:

```powershell
npm start
```

Você deverá ver:

```
✅ Base de dados MySQL conectada com sucesso!
🚀 Servidor rodando na porta 3000
📱 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
```

### 5️⃣ Acessar a Aplicação

Abra o navegador e aceda a:

- **Frontend**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard.html

## 👥 Utilizadores de Teste

Após importar a base de dados, pode usar estas credenciais para testar:

| Email | Senha | Tipo |
|-------|-------|------|
| admin@dermacare.pt | admin123 | Administrador |
| medico@dermacare.pt | medico123 | Médico |
| paciente@dermacare.pt | paciente123 | Paciente |

## 📁 Estrutura do Projeto

```
clinica/
├── config/              # Configurações (BD, JWT)
├── controllers/         # (Futuro: Lógica de negócio)
├── middleware/          # Middleware de autenticação
├── models/             # Modelos da base de dados
├── routes/             # Rotas da API
├── public/             # Frontend
│   ├── css/           # Estilos
│   ├── js/            # JavaScript
│   ├── index.html     # Página inicial
│   ├── services.html  # Serviços
│   ├── appointments.html  # Marcações
│   ├── contact.html   # Contacto
│   ├── login.html     # Login/Registo
│   └── dashboard.html # Painel Admin
├── database/          # Schema SQL
├── .env               # Variáveis de ambiente
├── package.json       # Dependências
└── server.js          # Servidor principal
```

## 🔧 Resolução de Problemas

### Erro: "Cannot connect to MySQL"

- Certifique-se de que o WAMP Server está a correr
- Verifique se o MySQL está ativo (ícone verde no WAMP)
- Confirme as credenciais no arquivo `.env`

### Erro: "Port 3000 is already in use"

- Altere a porta no arquivo `.env`:
  ```
  PORT=3001
  ```

### Erro: "Module not found"

- Execute novamente:
  ```powershell
  npm install
  ```

### Base de dados não importada corretamente

- Verifique se a base de dados `clinica_dermacare` foi criada
- Reimporte o arquivo `database/schema.sql`

## 🌐 Funcionalidades Implementadas

### Frontend
- ✅ Página inicial responsiva
- ✅ Página de serviços com preços
- ✅ Formulário de contacto
- ✅ Sistema de marcação de consultas
- ✅ Login e registo de utilizadores
- ✅ Dashboard administrativo

### Backend
- ✅ API RESTful completa
- ✅ Autenticação JWT
- ✅ Gestão de utilizadores (Admin, Médico, Paciente)
- ✅ Sistema de marcações com validação
- ✅ Gestão de serviços
- ✅ Mensagens de contacto

### Base de Dados
- ✅ Tabelas: users, services, appointments, contact_messages
- ✅ Relações e índices
- ✅ Dados de exemplo

## 📱 Testar a Aplicação

1. **Como Visitante:**
   - Navegue pelas páginas
   - Veja os serviços
   - Envie uma mensagem de contacto

2. **Como Paciente:**
   - Registe-se ou faça login
   - Marque uma consulta
   - Veja suas consultas no dashboard

3. **Como Médico:**
   - Login: medico@dermacare.pt / medico123
   - Veja suas consultas
   - Confirme e complete consultas

4. **Como Admin:**
   - Login: admin@dermacare.pt / admin123
   - Acesso total ao sistema
   - Gerir todos os utilizadores e consultas
   - Ver mensagens de contacto

## 📞 Suporte

Para questões ou problemas, verifique:
- Logs do servidor no terminal
- Console do navegador (F12)
- Logs do MySQL no WAMP

## 🎉 Pronto!

A aplicação está agora totalmente funcional e pronta para uso!
