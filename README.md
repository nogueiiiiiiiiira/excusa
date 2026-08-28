# Salon Manager

Sistema web de gerenciamento de salão.


O sistema permite cadastrar, consultar, editar e excluir clientes, procedimentos e agendamentos, além de exibir detalhes e históricos das operações.

## Tecnologias

- React + Vite no frontend
- Node.js + Express no backend
- MySQL com `mysql2`
- Axios para comunicação entre frontend e API

## Como executar

1. Importe [database.sql](database.sql) no MySQL.
2. Entre em `backend`, copie `.env.example` para `.env` e preencha os dados do MySQL.
3. Execute `npm install` e `npm start` dentro de `backend`.
4. Em outro terminal, entre em `frontend`, execute `npm install` e `npm run dev`.
5. Abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

Para gerar a versão de produção, execute `npm run build` dentro de `frontend`.

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
