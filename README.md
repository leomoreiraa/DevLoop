# Aplicação de Mentoria - Portfolio

Esta aplicação fullstack foi desenvolvida com Java Spring Boot no backend e React (Vite) no frontend, com um estilo moderno e minimalista inspirado no Notion.

## Estrutura do Projeto

- **Backend**: API RESTful em Java com Spring Boot
- **Frontend**: Interface de usuário em React com Vite e Tailwind CSS

## Requisitos

- Java 11 ou superior
- Node.js 16 ou superior
- Docker (para rodar o frontend)
- Maven (para o backend)

## Executando o Backend

1. Navegue até a pasta do backend:
   ```
   cd backend/backend
   ```

2. Execute o backend com Maven:
   ```
   mvn spring-boot:run
   ```

3. O backend estará disponível em `http://localhost:8081`

## Executando o Frontend

### Opção 1: Usando Docker (Recomendado)

1. Navegue até a pasta do frontend:
   ```
   cd frontend
   ```

2. Construa a imagem Docker:
   ```
   docker build -t portfolio-frontend .
   ```

3. Execute o container:
   ```
   docker run -p 3000:80 portfolio-frontend
   ```

4. Acesse o frontend em `http://localhost:3000`

### Opção 2: Desenvolvimento Local

1. Navegue até a pasta do frontend:
   ```
   cd frontend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   ```

4. Acesse o frontend em `http://localhost:5173`

## Funcionalidades

- Autenticação de usuários (login/registro)
- Perfis de mentores e mentorados
- Agendamento de sessões de mentoria
- Sistema de avaliações
- Chat entre mentor e mentorado
- Gerenciamento de disponibilidade

## Configuração do Backend

O backend está configurado para usar um banco de dados H2 em memória para facilitar os testes. As configurações podem ser ajustadas no arquivo `application.properties`.

## Notas de Desenvolvimento

Esta aplicação foi desenvolvida como um projeto de portfólio e demonstra a integração entre um backend Java Spring Boot e um frontend React moderno.
