# Todo List Backend

A NestJS backend service for managing todo items with SQLite database.

## Features

- RESTful API for todo management
- SQLite database with TypeORM
- CORS enabled for frontend communication
- Input validation with class-validator
- Full CRUD operations for todos

## API Endpoints

- `GET /todos` - Get all todos
- `GET /todos/:id` - Get a specific todo
- `POST /todos` - Create a new todo
- `PATCH /todos/:id` - Update a todo
- `PATCH /todos/:id/toggle` - Toggle todo completion
- `POST /todos/reorder` - Reorder todos
- `DELETE /todos/:id` - Delete a todo

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Database

The application uses SQLite with TypeORM. The database file (`todos.db`) will be created automatically when you first run the application.
