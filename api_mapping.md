# Mapeamento da API Backend (DevLoop)

Este documento descreve os endpoints e estruturas de dados da API backend fornecida.

## Autenticação

- Utiliza JSON Web Tokens (JWT) para autenticação.
- O token JWT deve ser incluído no cabeçalho `Authorization` como `Bearer <token>` para acessar endpoints protegidos.
- CORS configurado para permitir todas as origens (`*`).

## Endpoints

### Autenticação (`/auth`)

- **`POST /auth/login`**
  - **Descrição:** Autentica um usuário e retorna um token JWT.
  - **Autenticação:** Pública.
  - **Request Body:** `LoginRequest` (`{ "email": "string", "password": "string" }`)
  - **Response:** `String` (Token JWT) ou erro 401.

- **`POST /auth/register`**
  - **Descrição:** Registra um novo usuário.
  - **Autenticação:** Pública.
  - **Request Body:** `RegisterRequest` (`{ "username": "string", "email": "string", "password": "string", "role": "MENTOR" | "MENTEE" }`)
  - **Response:** `String` ("User registered successfully") ou erro.

### Usuários (`/api/users`)

- **`GET /api/users`**
  - **Descrição:** Retorna uma lista de todos os usuários.
  - **Autenticação:** JWT Requerido.
  - **Response:** `List<User>`

- **`GET /api/users/{id}`**
  - **Descrição:** Retorna um usuário específico pelo ID.
  - **Autenticação:** JWT Requerido.
  - **Response:** `User`

- **`POST /api/users`**
  - **Descrição:** Cria um novo usuário (verificar permissões no backend, pode ser apenas admin).
  - **Autenticação:** JWT Requerido.
  - **Request Body:** `User`
  - **Response:** `User` (criado) com status 201.

- **`PUT /api/users/{id}`**
  - **Descrição:** Atualiza um usuário existente.
  - **Autenticação:** JWT Requerido.
  - **Request Body:** `User`
  - **Response:** `User` (atualizado).

- **`DELETE /api/users/{id}`**
  - **Descrição:** Deleta um usuário.
  - **Autenticação:** JWT Requerido.
  - **Response:** Status 204 (No Content).

- **`GET /api/users/me`**
  - **Descrição:** Retorna os dados do usuário autenticado atualmente.
  - **Autenticação:** JWT Requerido.
  - **Response:** `User`

### Disponibilidades (`/api/availabilities`)

- **`POST /api/availabilities`**
  - **Descrição:** Cria um novo horário de disponibilidade para o mentor autenticado.
  - **Autenticação:** JWT Requerido (usuário deve ser MENTOR).
  - **Request Body:** `Availability` (`{ "start": "ISO_DATE_TIME_STRING", "end": "ISO_DATE_TIME_STRING" }`)
  - **Response:** `Availability` (criada).

- **`GET /api/availabilities`**
  - **Descrição:** Retorna todas as disponibilidades. Pode ser filtrado por `mentorId`.
  - **Autenticação:** JWT Requerido.
  - **Query Params:** `mentorId` (opcional, Long)
  - **Response:** `List<Availability>`

### Sessões (`/sessions` - *Atenção: path não começa com /api*)

- **`POST /sessions`**
  - **Descrição:** Cria (agenda) uma nova sessão entre o mentee autenticado e um mentor especificado, consumindo um slot de disponibilidade.
  - **Autenticação:** JWT Requerido (usuário deve ser MENTEE).
  - **Request Body:** `Session` (`{ "mentor": { "id": Long }, "scheduledTime": "ISO_DATE_TIME_STRING", "topic": "string" }`)
  - **Response:** `Session` (criada) ou erro 400 se não houver disponibilidade.

- **`GET /sessions`**
  - **Descrição:** Retorna todas as sessões.
  - **Autenticação:** JWT Requerido.
  - **Response:** `List<Session>`

- **`GET /sessions/{id}`**
  - **Descrição:** Retorna uma sessão específica pelo ID.
  - **Autenticação:** JWT Requerido.
  - **Response:** `Session`

- **`PUT /sessions/{id}`**
  - **Descrição:** Atualiza uma sessão existente (ex: status).
  - **Autenticação:** JWT Requerido.
  - **Request Body:** `Session`
  - **Response:** `Session` (atualizada).

- **`DELETE /sessions/{id}`**
  - **Descrição:** Deleta uma sessão.
  - **Autenticação:** JWT Requerido.
  - **Response:** Status 204 (No Content).

### Reviews (`/api/reviews`)

- **`POST /api/reviews`**
  - **Descrição:** Cria uma nova review para uma sessão concluída, feita pelo usuário autenticado.
  - **Autenticação:** JWT Requerido.
  - **Request Body:** `ReviewDto` (`{ "sessionId": Long, "mentorId": Long, "rating": int, "comment": "string" }`)
  - **Response:** `ReviewDto` (criada).

- **`GET /api/reviews/{sessionId}`**
  - **Descrição:** Retorna todas as reviews para uma sessão específica.
  - **Autenticação:** JWT Requerido.
  - **Response:** `List<ReviewDto>`

- **`PUT /api/reviews/{id}`**
  - **Descrição:** Atualiza uma review existente.
  - **Autenticação:** JWT Requerido.
  - **Request Body:** `ReviewDto`
  - **Response:** `ReviewDto` (atualizada).

- **`DELETE /api/reviews/{id}`**
  - **Descrição:** Deleta uma review.
  - **Autenticação:** JWT Requerido.
  - **Response:** Status 204 (No Content).

### Chat (WebSocket)

- **Endpoint de Conexão:** `/ws` (configurado em `WebSocketConfig.java`)
- **Subscrição:** `/topic/session/{id}` (para receber mensagens de uma sessão específica)
- **Envio:** `/app/session/{id}/send`
  - **Payload:** `Message` (`{ "senderId": Long, "sessionId": Long, "content": "string" }`)
  - **Autenticação:** A conexão WebSocket provavelmente requer um token JWT (precisa verificar a implementação exata ou testar).

## Estruturas de Dados Principais (Entidades/DTOs)

- **`User`**: `id`, `username`, `email`, `password_hash`, `role` (`MENTOR`/`MENTEE`), `availabilities`, `sessionsAsMentor`, `sessionsAsMentee`, `reviewsGiven`
- **`Availability`**: `id`, `mentor` (User), `start` (LocalDateTime), `end` (LocalDateTime)
- **`Session`**: `id`, `mentor` (User), `mentee` (User), `scheduledTime` (LocalDateTime), `topic` (String), `status` (String - verificar valores possíveis)
- **`Review`**: `id`, `session` (Session), `reviewer` (User), `mentor` (User), `rating` (int), `comment` (String)
- **`ReviewDto`**: `id`, `sessionId`, `reviewerId`, `mentorId`, `rating`, `comment`
- **`Message`**: `id`, `sender` (User), `session` (Session), `content` (String), `timestamp` (LocalDateTime)
- **`LoginRequest`**: `email`, `password`
- **`RegisterRequest`**: `username`, `email`, `password`, `role`

