# DevLoop - Plataforma de Mentoria para Desenvolvedores

DevLoop é uma plataforma web completa que conecta mentores e mentorados da área de tecnologia, facilitando o agendamento de sessões, comunicação em tempo real e acompanhamento do desenvolvimento profissional.

## Demonstração

Acesse a versão online: [https://leomoreiraa.github.io/DevLoop/](https://leomoreiraa.github.io/DevLoop/)

Backend hospedado em: [https://devloop-backend.fly.dev/](https://devloop-backend.fly.dev/)

---

## Funcionalidades Principais

- **Cadastro e autenticação de usuários** (mentor ou mentee)
- **Gerenciamento de disponibilidade** para mentores
- **Agendamento de sessões de mentoria**
- **Chamadas de vídeo em tempo real** (WebRTC)
- **Upload e compartilhamento de vídeos** relacionados às sessões
- **Chat integrado** para comunicação entre mentor e mentee
- **Avaliação de sessões e feedback**
- **Interface responsiva e intuitiva** para desktop e mobile

---

## Estrutura do Projeto

- `/frontend` — Aplicação React (Vite)
- `/backend` — API Java Spring Boot

---

## Tecnologias Utilizadas

- **Frontend:** React, Vite, TailwindCSS, React Router, Axios, WebRTC
- **Backend:** Java 11+, Spring Boot, Spring Security, JWT, Maven
- **Banco de Dados:** (configurável no backend)
- **Deploy:** GitHub Pages (frontend), Fly.io (backend)
- **Docker:** Suporte para ambos os ambientes

---

## Como Executar Localmente

### Pré-requisitos

- Node.js 20+ e npm (ou yarn)
- Java 11+ e Maven
- Docker (opcional, para execução em containers)

### Backend

```bash
cd backend
mvn spring-boot:run
```

ou com Docker:

```bash
cd backend
docker build -t devloop-backend .
docker run -p 8080:8080 devloop-backend
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

ou com Docker:

```bash
cd frontend
docker build -t devloop-frontend .
docker run -p 80:80 devloop-frontend
```

---

## Configuração de Ambiente

O frontend utiliza variáveis de ambiente para definir a URL da API:

- **Desenvolvimento:**  
  Crie um arquivo `.env` em `/frontend`:
  ```
  VITE_API_URL=http://localhost:8080
  ```

- **Produção:**  
  Crie um arquivo `.env.production` em `/frontend`:
  ```
  VITE_API_URL=https://devloop-backend.fly.dev
  ```

---

## Principais Telas

- **Dashboard:** Visão geral das sessões e notificações
- **Agenda:** Visualização e agendamento de sessões
- **Perfil:** Gerenciamento de dados do usuário e avaliações
- **Chat:** Comunicação em tempo real durante as sessões
- **Disponibilidade:** Configuração de horários para mentores

---

## Licença

Este projeto está licenciado sob a licença MIT.

---

## Sobre

DevLoop foi desenvolvido para facilitar o crescimento profissional de desenvolvedores, promovendo conexões de qualidade entre mentores e mentorados, com recursos modernos de comunicação e acompanhamento.

---
