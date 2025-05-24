# DevLoop Backend

DevLoop is a full-stack application designed to facilitate mentorship between developers. This backend component is built using Java 21 with Spring Boot and provides a RESTful API for the frontend application.

## Features

- **Authentication**: Implements JWT-based authentication and authorization using Spring Security.
- **User Management**: CRUD operations for users, allowing for registration and profile management.
- **Session Management**: Users can schedule mentoring sessions, which can be managed through the API.
- **Real-Time Chat**: Utilizes WebSocket with STOMP for real-time chat functionality between mentors and mentees.
- **Reviews**: Users can leave reviews for sessions, including ratings and comments.

## Technologies Used

- **Java 21**: The programming language used for the backend.
- **Spring Boot**: Framework for building the backend application.
- **PostgreSQL**: The database used for storing user, session, review, and message data.
- **Docker**: Used for containerization of the application and database.
- **Maven**: Dependency management and build tool.

## Getting Started

### Prerequisites

- Java 21
- Docker
- Maven

### Running the Application

1. Clone the repository:
   ```
   git clone <repository-url>
   cd devloop/backend
   ```

2. Build the Docker images:
   ```
   docker-compose build
   ```

3. Start the application and database:
   ```
   docker-compose up
   ```

4. Access the API at `http://localhost:8080`.

### API Documentation

API endpoints are documented using Swagger. You can access the Swagger UI at `http://localhost:8080/swagger-ui.html` after starting the application.

## Directory Structure

- `src/main/java/com/devloop`: Contains the main application code.
- `src/main/resources`: Contains configuration files and static resources.
- `Dockerfile`: Instructions for building the Docker image.
- `docker-compose.yml`: Defines services for the backend and PostgreSQL database.
- `pom.xml`: Maven configuration file for dependencies and build settings.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.