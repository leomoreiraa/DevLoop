# Fluxo de Telas e Layout do Frontend (Estilo Notion)

Este documento descreve o fluxo de telas e o layout planejado para o frontend React, inspirado no estilo moderno e minimalista do Notion, baseado na API mapeada.

## 1. Estilo Geral

- **Inspiração:** Notion.so
- **Paleta de Cores:** Minimalista (tons de cinza, branco, preto, com um cor de destaque sutil).
- **Tipografia:** Fontes limpas e legíveis (ex: Inter, Sans-serif).
- **Layout:** Limpo, com bastante espaço em branco. Uso de componentes como cards, modais e sidebars discretos.
- **UI Library/Framework:** Considerar Tailwind CSS para flexibilidade ou uma biblioteca de componentes minimalista como Mantine UI ou Chakra UI.

## 2. Estrutura de Pastas (React)

```
/src
  /assets         # Imagens, fontes, etc.
  /components     # Componentes reutilizáveis (Button, Input, Card, Modal, Sidebar, etc.)
  /constants      # Constantes (ex: API_URL)
  /contexts       # Contextos (AuthContext, etc.)
  /hooks          # Hooks customizados (useAuth, useApi, etc.)
  /layouts        # Layouts de página (AuthLayout, DashboardLayout)
  /pages          # Componentes de página (HomePage, LoginPage, DashboardPage, etc.)
  /services       # Lógica de chamada da API (authService, userService, etc.)
  /styles         # Estilos globais, temas
  /utils          # Funções utilitárias
  App.js          # Roteamento principal
  index.js        # Ponto de entrada
```

## 3. Fluxo de Telas

### 3.1. Telas Públicas (Layout Simples)

- **`/` (Landing Page):**
    - Layout minimalista.
    - Título/Descrição breve da plataforma.
    - Botões grandes e claros: "Entrar" e "Registrar-se".
    - Talvez uma ilustração ou imagem sutil.
- **`/login` (Página de Login):**
    - Formulário centralizado.
    - Campos: Email, Senha.
    - Botão "Entrar".
    - Link para "Registrar-se".
- **`/register` (Página de Registro):**
    - Formulário centralizado.
    - Campos: Nome de usuário, Email, Senha, Seleção de Role (Mentor/Mentee).
    - Botão "Registrar".
    - Link para "Entrar".

### 3.2. Telas Autenticadas (Layout Dashboard - Estilo Notion)

- **Layout Base:**
    - Sidebar à esquerda (navegação principal, talvez expansível/recolhível).
    - Conteúdo principal à direita.
    - Header (opcional, pode conter informações do usuário, botão de logout).
- **`/dashboard` (Página Principal Pós-Login):**
    - Conteúdo varia por Role (Mentor/Mentee).
    - **Mentor:** Resumo de próximas sessões, acesso rápido para gerenciar disponibilidades.
    - **Mentee:** Resumo de próximas sessões, acesso rápido para buscar mentores.
- **`/profile` (Perfil do Usuário):**
    - Visualização dos dados do usuário (`GET /api/users/me`).
    - Formulário para edição (Nome, talvez outras informações) (`PUT /api/users/{id}`).
- **`/mentors` (Buscar Mentores - para Mentees):**
    - Lista de usuários com role MENTOR (`GET /api/users` filtrado).
    - Cards minimalistas para cada mentor (Nome, talvez especialidade).
    - Link para perfil detalhado do mentor.
- **`/mentors/{id}` (Perfil do Mentor - para Mentees):**
    - Detalhes do mentor (`GET /api/users/{id}`).
    - Lista de reviews (`GET /api/reviews/{sessionId}` - *precisa ajustar API ou buscar reviews por mentor*).
    - Calendário/Lista de disponibilidades (`GET /api/availabilities?mentorId={id}`).
    - Botão para agendar sessão (abre modal/leva para página de agendamento).
- **`/availability` (Gerenciar Disponibilidade - para Mentores):**
    - Visualização das disponibilidades existentes (`GET /api/availabilities?mentorId=me`).
    - Formulário/Modal para adicionar nova disponibilidade (`POST /api/availabilities`).
    - Opção para remover disponibilidades.
- **`/sessions` (Minhas Sessões):**
    - Lista de sessões agendadas (passadas e futuras) (`GET /sessions` filtrado por usuário logado - mentor ou mentee).
    - Cards/Linhas com informações da sessão (Mentor/Mentee, Data/Hora, Tópico, Status).
    - Link para detalhes da sessão.
- **`/sessions/{id}` (Detalhes da Sessão):**
    - Informações detalhadas da sessão (`GET /sessions/{id}`).
    - **Componente de Chat:**
        - Conexão WebSocket (`/ws`).
        - Subscrição (`/topic/session/{id}`).
        - Envio de mensagens (`/app/session/{id}/send`).
        - Exibição do histórico de mensagens.
    - **Componente de Review (se aplicável):**
        - Exibir reviews existentes (`GET /api/reviews/{sessionId}`).
        - Formulário para adicionar/editar review (`POST /api/reviews`, `PUT /api/reviews/{id}`).

## 4. Gerenciamento de Estado

- **Autenticação:** Usar `Context API` (ou Zustand/Redux Toolkit) para gerenciar o estado de autenticação (usuário logado, token JWT).
- **Dados da API:** Gerenciar o estado localmente nos componentes ou usar bibliotecas como `React Query` ou `SWR` para caching, revalidação, etc.

## 5. Próximos Passos

- Criar a estrutura inicial do projeto React.
- Configurar o roteamento.
- Implementar o layout base (Auth e Dashboard).
- Configurar a UI library/framework escolhido.
- Implementar o fluxo de autenticação (Context, páginas, chamadas API).

