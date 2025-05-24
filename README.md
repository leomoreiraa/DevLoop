# DevLoop - Plataforma de Mentoria

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Placeholder: Adicione badges relevantes -->

<p align="center">
  <img src="./frontend/public/logo.svg" alt="DevLoop Logo" width="200"/>
</p>

<p align="center">
  Uma aplicação fullstack moderna para conectar mentores e mentorados, facilitando o agendamento e acompanhamento de sessões de mentoria.
</p>

---

## ✨ Visão Geral

DevLoop é uma plataforma de mentoria projetada para simplificar a interação entre profissionais experientes (Mentores) e aqueles que buscam orientação (Mentees). Inspirada em interfaces modernas e minimalistas como a do Notion, a plataforma oferece um ambiente intuitivo para gerenciamento de perfis, disponibilidades, agendamentos, comunicação e feedback.

Este projeto serve como um portfólio demonstrando a integração de tecnologias robustas de backend (Java Spring Boot) com um frontend reativo e elegante (React + Vite + Tailwind CSS).

## 🚀 Funcionalidades Principais

*   **Autenticação Segura:** Registro e Login de usuários com JWT (JSON Web Tokens).
*   **Perfis Detalhados:** Criação e gerenciamento de perfis para Mentores e Mentees.
*   **Busca de Mentores:** Mentees podem pesquisar e visualizar perfis de mentores disponíveis.
*   **Gerenciamento de Disponibilidade:** Mentores podem definir e atualizar seus horários disponíveis para sessões.
*   **Agendamento Inteligente:** Mentees podem agendar sessões com base na disponibilidade do mentor.
*   **Comunicação em Tempo Real:** Chat integrado via WebSockets para comunicação durante as sessões.
*   **Sistema de Avaliação:** Mentees podem avaliar mentores após as sessões.
*   **Dashboard Personalizado:** Visão geral de atividades e próximos passos para cada tipo de usuário.

## 🛠️ Tecnologias Utilizadas

*   **Backend:**
    *   Java 11+
    *   Spring Boot
    *   Spring Security (JWT)
    *   Spring Data JPA / Hibernate
    *   Maven
    *   Banco de Dados: H2 (em memória, padrão para desenvolvimento), PostgreSQL (pronto para produção)
    *   WebSockets (Spring WebSocket)
*   **Frontend:**
    *   React 18+
    *   Vite
    *   Tailwind CSS
    *   Axios (para chamadas API)
    *   React Router DOM
    *   Context API (para gerenciamento de estado de autenticação)
*   **Ambiente:**
    *   Docker & Docker Compose (para fácil execução e deploy)
    *   Node.js 16+

## 🏗️ Arquitetura

A aplicação segue uma arquitetura cliente-servidor padrão:

1.  **Frontend (React):** Interface do usuário responsável pela apresentação e interação. Consome a API RESTful do backend.
2.  **Backend (Spring Boot):** API RESTful que gerencia a lógica de negócios, acesso aos dados e autenticação. Expõe endpoints para o frontend e gerencia conexões WebSocket para o chat.
3.  **Banco de Dados:** Persiste os dados da aplicação (usuários, sessões, etc.).
4.  **WebSocket:** Canal de comunicação bidirecional para o chat em tempo real.

## ⚙️ Instalação e Execução

### Pré-requisitos

*   **Git:** Para clonar o repositório.
*   **Java JDK 11 ou superior:** Para o backend.
*   **Maven:** Para gerenciar dependências e build do backend.
*   **Node.js 16 ou superior & npm:** Para o frontend.
*   **Docker & Docker Compose (Recomendado):** Para execução simplificada em contêineres.

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd DevLoop
```

### 2. Executar o Backend

```bash
cd backend
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080` (verifique `application.properties` para a porta exata).

*Nota: Por padrão, utiliza um banco de dados H2 em memória. Para usar PostgreSQL, ajuste o `application.properties` e garanta que o banco esteja acessível.*

### 3. Executar o Frontend

#### Opção A: Usando npm (Desenvolvimento)

```bash
cd frontend
npm install
npm run dev
```

Acesse o frontend em `http://localhost:5173` (ou a porta indicada pelo Vite).

#### Opção B: Usando Docker (Recomendado para Simplicidade)

Certifique-se de que o Docker está em execução.

```bash
# A partir da raiz do projeto (DevLoop)
docker-compose up --build
```

Isso irá construir e iniciar os contêineres do backend e frontend.
*   Backend: `http://localhost:8080`
*   Frontend: `http://localhost:3000`

*(Verifique as portas no arquivo `docker-compose.yml`)*

## 📖 Uso

1.  **Registro:** Acesse a página de registro e crie uma conta como Mentor ou Mentee.
2.  **Login:** Faça login com suas credenciais.
3.  **Dashboard:** Explore seu dashboard com informações relevantes.
4.  **(Mentee) Buscar Mentores:** Navegue pela lista de mentores disponíveis.
5.  **(Mentor) Definir Disponibilidade:** Acesse a seção de disponibilidade e defina seus horários.
6.  **(Mentee) Agendar Sessão:** Visite o perfil de um mentor e agende uma sessão em um horário disponível.
7.  **Sessão e Chat:** Acesse os detalhes da sessão agendada para iniciar o chat em tempo real.
8.  **Avaliação:** Após a sessão, deixe sua avaliação para o mentor.

## 📄 Documentação da API

Os detalhes sobre os endpoints da API RESTful, estruturas de dados e autenticação podem ser encontrados no arquivo [api_mapping.md](./api_mapping.md).

## 🤝 Contribuição

Contribuições são bem-vindas! Se você deseja contribuir com o projeto, por favor:

1.  Faça um Fork do repositório.
2.  Crie uma Branch para sua feature (`git checkout -b feature/MinhaFeature`).
3.  Faça o Commit de suas mudanças (`git commit -m 'Adiciona MinhaFeature'`).
4.  Faça o Push para a Branch (`git push origin feature/MinhaFeature`).
5.  Abra um Pull Request.

*Por favor, mantenha o estilo de código e adicione testes se aplicável.*

## 📜 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. (Nota: Adicione um arquivo LICENSE se ainda não existir).

## 📫 Contato

Se tiver dúvidas ou sugestões, sinta-se à vontade para abrir uma Issue no repositório.

---

*Desenvolvido com ❤️ como parte de um portfólio.*

