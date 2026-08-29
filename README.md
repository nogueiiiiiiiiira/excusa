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

## Referências de estudo

A lógica foi estudada e adaptada a partir da documentação oficial das tecnologias, com regras e telas próprias para este projeto:

- [React: componentes e estado](https://react.dev/learn)
- [React Router: rotas](https://reactrouter.com/start/declarative/routing)
- [Express: routing](https://expressjs.com/en/guide/routing.html)
- [Axios: requisições HTTP](https://axios-http.com/docs/intro)
- [MySQL2: prepared statements](https://sidorares.github.io/node-mysql2/docs)
- [MDN: Fetch e APIs HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)