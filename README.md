# DevLoop - Plataforma de Mentoria

DevLoop é uma plataforma de mentoria que conecta mentores e mentorados, permitindo agendamento de sessões, chamadas de vídeo em tempo real, upload de vídeos e chat integrado.

## Funcionalidades Implementadas

- Autenticação e registro de usuários (mentor/mentee)
- Gerenciamento de disponibilidade para mentores
- Agendamento de sessões de mentoria
- Chamadas de vídeo em tempo real
- Upload de vídeos relacionados às sessões
- Chat integrado para comunicação durante as sessões
- Interface responsiva e intuitiva

## Correções e Melhorias Realizadas

- Corrigido o fluxo de disponibilidade para garantir compatibilidade entre frontend e backend
- Ajustado o formato de dados para agendamento de sessões
- Implementada interface completa de vídeo e chat para sessões agendadas
- Preparado o frontend para execução em Docker

## Estrutura do Projeto

- `/frontend` - Aplicação React com Vite
- `/backend` - API Java Spring Boot

## Requisitos

### Frontend
- Node.js 20+
- npm ou yarn

### Backend
- Java 11+
- Maven

## Instruções de Execução

### Frontend (Desenvolvimento)

```bash
cd frontend
npm install
npm run dev
```

### Frontend (Produção com Docker)

```bash
cd frontend
docker build -t devloop-frontend .
docker run -p 80:80 devloop-frontend
```

### Backend (Desenvolvimento)

```bash
cd backend
mvn spring-boot:run
```

### Backend (Produção com Docker)

```bash
cd backend
docker build -t devloop-backend .
docker run -p 8080:8080 devloop-backend
```

## Configuração de Ambiente

Por padrão, o frontend se conecta ao backend em `http://localhost:8080`. Para alterar esta configuração:

1. Crie um arquivo `.env.local` na pasta `frontend`
2. Adicione a variável `VITE_API_URL` com o endereço do backend

Exemplo:
```
VITE_API_URL=http://api.seudominio.com
```

## Notas para Desenvolvedores

### Fluxo de Disponibilidade

O frontend agora converte corretamente os slots de horário selecionados para objetos de data ISO compatíveis com o backend. Isso garante que o agendamento funcione corretamente.

### Chamadas de Vídeo

A implementação atual usa WebRTC simulado para demonstração. Em produção, recomenda-se integrar com um serviço como Twilio, Agora.io ou Amazon Chime.

### Upload de Vídeo

O componente de upload está preparado para integração com backend. Em produção, recomenda-se configurar limites de tamanho e formatos adequados.

## Próximos Passos

- Implementar testes automatizados
- Adicionar funcionalidade de gravação de sessões
- Melhorar a interface de avaliação pós-sessão
- Implementar dashboard analítico para mentores

## Licença

Este projeto está licenciado sob a licença MIT.
