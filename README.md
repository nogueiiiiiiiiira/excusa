# Salon Manager

Sistema web de gerenciamento de salão.


O sistema permite cadastrar, consultar, editar e excluir clientes, procedimentos e agendamentos, além de exibir detalhes e históricos das operações.

## Tecnologias

- React + Vite no frontend
- Node.js + Express no backend
- MySQL com `mysql2`
- Axios para comunicação entre frontend e API

## Requisitos de Sistema

- Node.js (v18+)
- npm ou yarn
- MySQL (v5.7+)

## Como executar

### Passo 1: Configurar o Banco de Dados
1. Abra o MySQL e importe o arquivo [database.sql](database.sql):
   ```sql
   mysql -u root -p < database.sql
   ```
   Ou importe via ferramentas como MySQL Workbench.

### Passo 2: Configurar Variáveis de Ambiente

#### Backend
Entre em `backend` e copie `.env.example` para `.env`:
```bash
cp .env.example .env
```
Edite `.env` com suas credenciais do MySQL:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=salon
DB_PORT=3306
FRONTEND_URL=http://localhost:5173
```

#### Frontend
Entre em `frontend` e copie `.env.example` para `.env`:
```bash
cp .env.example .env
```
Verifique se contém:
```
VITE_API_URL=http://localhost:5000
```

### Passo 3: Instalar Dependências e Executar

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Passo 4: Acessar a Aplicação
Abra seu navegador e acesse:
```
http://localhost:5173
```

## Build para Produção

Para gerar a versão otimizada do frontend:
```bash
cd frontend
npm run build
```
Os arquivos compilados estarão em `frontend/dist/`.

## Funcionalidades

- Listagens paginadas com busca e filtro de status.
- Cadastro, edição, exclusão e visualização detalhada.
- Validação de dados e mensagens de erro para o usuário.
- Histórico geral e histórico do sistema registrados por triggers do MySQL.

## Referências de estudo

A lógica foi estudada e adaptada a partir da documentação oficial das tecnologias, com regras e telas próprias para este projeto:

- [React: componentes e estado](https://react.dev/learn)
- [React Router: rotas](https://reactrouter.com/start/declarative/routing)
- [Express: routing](https://expressjs.com/en/guide/routing.html)
- [Axios: requisições HTTP](https://axios-http.com/docs/intro)
- [MySQL2: prepared statements](https://sidorares.github.io/node-mysql2/docs)
- [MDN: Fetch e APIs HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

## Estrutura do Projeto

```
excusa/
├── backend/              # Servidor Node.js + Express
│   ├── config/          # Configuração do banco de dados
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/      # Middleware (erro, async)
│   ├── routes/          # Rotas da API
│   ├── validation.js    # Funções de validação
│   ├── package.json
│   └── index.js
├── frontend/            # Aplicação React + Vite
│   ├── src/
│   │   ├── pages/       # Páginas (Clients, Procedures, Appointments, etc.)
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── App.jsx      # Rotas principais
│   │   └── api.js       # Configuração do Axios
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── database.sql         # Script de criação do banco
└── README.md
```

## Funcionalidades Implementadas

### Clientes
- ✅ Listar clientes com paginação e busca
- ✅ Adicionar novo cliente
- ✅ Editar cliente existente
- ✅ Deletar cliente
- ✅ Visualizar detalhes do cliente

### Procedimentos
- ✅ Listar procedimentos com paginação e busca
- ✅ Adicionar novo procedimento
- ✅ Editar procedimento
- ✅ Deletar procedimento
- ✅ Visualizar detalhes

### Agendamentos
- ✅ Listar agendamentos com paginação e filtro de status
- ✅ Agendar novo procedimento
- ✅ Editar agendamento
- ✅ Cancelar/deletar agendamento
- ✅ Visualizar detalhes do agendamento

### Histórico
- ✅ Histórico geral de operações (ações de clientes, procedimentos e agendamentos)
- ✅ Histórico do sistema (rastreamento de entidades alteradas)
- ✅ Registros protegidos (triggers para impedir edição/deleção do histórico)

## Validações

### Clientes
- Nome é obrigatório
- Telefone deve ser um formato válido brasileiro: `(XX) 9XXXX-XXXX` ou `(XX) XXXX-XXXX`
- Email deve ser válido (se preenchido)

### Procedimentos
- Nome é obrigatório
- Duração deve ser um número positivo (minutos)
- Preço deve ser um número não-negativo

### Agendamentos
- Cliente e Procedimento são obrigatórios
- Data/hora do agendamento é obrigatória
- Status deve ser um dos: `scheduled`, `confirmed`, `done`, `canceled`, `missed`, `late`
- Status de pagamento deve ser: `pending` ou `paid`

## Troubleshooting

### Erro: "Unable to reach the server"
- Verifique se o backend está rodando (`npm start` no terminal 1)
- Confirme que a porta 5000 está disponível
- Verifique `.env` no frontend (VITE_API_URL)

### Erro ao conectar no MySQL
- Verifique credenciais em `backend/.env`
- Confirme que MySQL está rodando
- Verifique se o banco `salon` foi criado (execute `database.sql`)

### Porta 5173 já está em uso
- Kill o processo: `lsof -i :5173` (macOS/Linux) ou `netstat -ano | findstr :5173` (Windows)
- Ou especifique outra porta no `vite.config.js`

## Autor

**Karen Nogueira**

Desenvolvido como projeto educacional para aprendizado de React, Node.js e MySQL.
