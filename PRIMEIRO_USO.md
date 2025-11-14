# 🎯 Guia de Primeiro Uso - Clínica DermaCare

## ⚡ Início Rápido (5 minutos)

### Passo 1: Verificar WAMP Server

1. **Inicie o WAMP Server**
   - Clique no ícone do WAMP na bandeja do sistema
   - Aguarde até o ícone ficar **verde** (todos os serviços ativos)
   - Se ficar laranja/amarelo, verifique se Apache e MySQL estão rodando

### Passo 2: Importar Base de Dados

**Opção 1: Via phpMyAdmin (Mais Fácil)**

1. Abra o navegador e aceda: http://localhost/phpmyadmin
2. Clique em **"Novo"** no menu lateral esquerdo
3. Nome da base de dados: `clinica_dermacare`
4. Clique em **"Criar"**
5. Selecione a base de dados criada
6. Clique na aba **"Importar"**
7. Clique em **"Escolher arquivo"**
8. Navegue até: `C:\wamp64\www\clinica\database\schema.sql`
9. Clique em **"Executar"**
10. Aguarde a mensagem de sucesso ✅

**Opção 2: Via Terminal**

```powershell
# No PowerShell, navegue até a pasta do projeto
cd C:\wamp64\www\clinica

# Execute o comando (se o MySQL estiver no PATH)
mysql -u root -p < database/schema.sql
# Pressione Enter (sem senha, a menos que tenha configurado uma)
```

### Passo 3: Instalar Node.js (Se ainda não tiver)

1. Aceda: https://nodejs.org/
2. Baixe a versão **LTS** (recomendado)
3. Execute o instalador
4. Aceite todas as opções padrão
5. Reinicie o terminal após a instalação

Para verificar se instalou corretamente:
```powershell
node --version
npm --version
```

### Passo 4: Instalar Dependências

**Opção 1: Usando o arquivo .bat (Windows)**

1. Navegue até a pasta do projeto
2. Duplo clique no arquivo **`iniciar.bat`**
3. O script irá:
   - Verificar se o Node.js está instalado
   - Instalar as dependências automaticamente
   - Iniciar o servidor

**Opção 2: Via Terminal**

```powershell
# Navegue até a pasta do projeto
cd C:\wamp64\www\clinica

# Instale as dependências
npm install

# Aguarde a instalação (pode demorar 1-2 minutos)
```

### Passo 5: Iniciar o Servidor

**Opção 1: Duplo clique em `iniciar.bat`**

**Opção 2: Via Terminal**

```powershell
# Iniciar em modo desenvolvimento (com auto-reload)
npm run dev

# OU iniciar em modo produção
npm start
```

Você deverá ver:
```
✅ Base de dados MySQL conectada com sucesso!
🚀 Servidor rodando na porta 3000
📱 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
```

### Passo 6: Acessar a Aplicação

1. Abra o navegador
2. Aceda: **http://localhost:3000**
3. Explore a página inicial da clínica! 🎉

## 🧪 Testar as Funcionalidades

### Teste 1: Explorar como Visitante

1. Navegue pela página inicial
2. Clique em **"Serviços"** no menu
3. Veja os tratamentos disponíveis e preços
4. Clique em **"Contacto"**
5. Preencha e envie uma mensagem de teste

### Teste 2: Login como Paciente

1. Clique em **"Login"** no menu
2. Na aba **"Registar"**, crie uma conta:
   - Nome: Seu nome
   - Email: seuemail@exemplo.com
   - Telefone: 912345678
   - Senha: teste123
3. Após registar, faça login
4. Você será redirecionado para o **Dashboard**

### Teste 3: Marcar uma Consulta

1. No menu, clique em **"Marcar Consulta"**
2. Preencha o formulário:
   - Serviço: Escolha um da lista
   - Médico: Escolha um médico
   - Data: Escolha uma data futura
   - Horário: Escolha um horário
   - Observações: (opcional)
3. Clique em **"Confirmar Marcação"**
4. Veja sua consulta na seção "Minhas Consultas"

### Teste 4: Login como Médico

1. Faça logout (canto superior direito → Sair)
2. Faça login com:
   - Email: **medico@dermacare.pt**
   - Senha: **medico123**
3. No Dashboard, você verá:
   - Suas consultas agendadas
   - Opções para confirmar consultas
   - Opções para completar consultas

### Teste 5: Login como Administrador

1. Faça logout
2. Faça login com:
   - Email: **admin@dermacare.pt**
   - Senha: **admin123**
3. No Dashboard, você terá acesso a:
   - **Visão Geral**: Estatísticas completas
   - **Consultas**: Todas as consultas do sistema
   - **Pacientes**: Lista de todos os pacientes
   - **Mensagens**: Mensagens de contacto recebidas

## 📋 Checklist de Verificação

Marque ✅ conforme completa cada item:

- [ ] WAMP Server está rodando (ícone verde)
- [ ] Base de dados `clinica_dermacare` foi criada
- [ ] Tabelas foram importadas com sucesso
- [ ] Node.js está instalado (`node --version` funciona)
- [ ] Dependências foram instaladas (`node_modules` existe)
- [ ] Servidor Node.js está rodando
- [ ] Consegui acessar http://localhost:3000
- [ ] Consegui fazer login com os utilizadores de teste
- [ ] Consegui marcar uma consulta
- [ ] Consegui ver o dashboard

## 🆘 Resolução de Problemas Comuns

### ❌ "npm não é reconhecido"

**Solução**: Node.js não está instalado ou não está no PATH
1. Instale o Node.js: https://nodejs.org/
2. Reinicie o terminal
3. Tente novamente

### ❌ "Cannot connect to MySQL"

**Solução**: WAMP não está rodando ou MySQL não está ativo
1. Inicie o WAMP Server
2. Aguarde o ícone ficar verde
3. Se necessário, reinicie o MySQL pelo painel do WAMP
4. Verifique as credenciais no arquivo `.env`

### ❌ "Port 3000 is already in use"

**Solução**: Outra aplicação está usando a porta 3000
1. Feche outras aplicações Node.js
2. OU altere a porta no arquivo `.env`:
   ```
   PORT=3001
   ```
3. Reinicie o servidor

### ❌ "Base de dados vazia / sem tabelas"

**Solução**: O schema.sql não foi importado
1. Aceda ao phpMyAdmin
2. Selecione a base de dados `clinica_dermacare`
3. Clique em "Importar"
4. Selecione `database/schema.sql`
5. Execute a importação

### ❌ Página em branco ou erro 404

**Solução**: Verifique se está acessando o endereço correto
- ✅ Correto: http://localhost:3000
- ❌ Errado: http://localhost/clinica

### ❌ "Token inválido" após login

**Solução**: Limpe o cache do navegador
1. Pressione `Ctrl + Shift + Delete`
2. Limpe cookies e dados de sites
3. OU abra em modo anónimo/privado
4. Faça login novamente

## 🎓 Próximos Passos

Após testar com sucesso:

1. **Personalize a clínica**
   - Edite os textos em `public/*.html`
   - Altere as cores em `public/css/style.css`
   - Adicione o logo da clínica

2. **Configure Email** (opcional)
   - Integre um serviço de email (Nodemailer)
   - Configure notificações automáticas

3. **Adicione mais serviços**
   - Via dashboard ou direto no banco de dados
   - Customize preços e durações

4. **Crie mais utilizadores**
   - Adicione médicos reais com especialidades
   - Configure perfis de pacientes

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no terminal onde o servidor está rodando
2. Abra o Console do navegador (F12) para ver erros JavaScript
3. Consulte o arquivo `INSTALACAO.md` para troubleshooting detalhado
4. Verifique se todas as dependências foram instaladas corretamente

## ✅ Está Funcionando?

Se você conseguiu:
- ✅ Ver a página inicial
- ✅ Fazer login
- ✅ Marcar uma consulta
- ✅ Acessar o dashboard

**Parabéns! 🎉** O sistema está totalmente funcional!

---

**Dica**: Mantenha o WAMP Server e o servidor Node.js sempre rodando enquanto estiver usando o sistema.

**Atalho útil**: Crie um atalho para o arquivo `iniciar.bat` na sua área de trabalho para iniciar rapidamente!
