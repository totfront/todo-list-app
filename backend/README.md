# Todo Backend - Express.js

A simple Express.js backend for the todo list application with SQLite database.

## Features

- ✅ **RESTful API** for todo management
- ✅ **SQLite database** for data persistence
- ✅ **CORS enabled** for frontend communication
- ✅ **Automatic timestamps** (createdAt, updatedAt)
- ✅ **Input validation** and error handling
- ✅ **Health check endpoint**

## API Endpoints

### Todos

| Method   | Endpoint            | Description                              |
| -------- | ------------------- | ---------------------------------------- |
| `GET`    | `/todos`            | Get all todos (ordered by creation time) |
| `POST`   | `/todos`            | Create a new todo                        |
| `PATCH`  | `/todos/:id`        | Update a todo                            |
| `PATCH`  | `/todos/:id/toggle` | Toggle todo completion                   |
| `DELETE` | `/todos/:id`        | Delete a todo                            |

### Utility

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| `GET`  | `/health`           | Health check endpoint |
| `GET`  | `/todos/test-error` | Test error endpoint   |

## Data Structure

### Todo Object

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2025-08-05T16:30:55.000Z",
  "updatedAt": "2025-08-05T16:30:55.000Z"
}
```

### Create Todo Request

```json
{
  "title": "New todo title"
}
```

### Update Todo Request

```json
{
  "title": "Updated title",
  "completed": true
}
```

## Installation

```bash
npm install
```

## Running the Server

### Development (with auto-restart)

```bash
npm run dev
```

### Production

```bash
npm start
```

## Database

- **Type**: SQLite
- **File**: `todos.db` (created automatically)
- **Table**: `todos`

### Schema

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `404` - Not Found (todo doesn't exist)
- `500` - Internal Server Error (database/server errors)

## CORS Configuration

Configured to allow requests from `http://localhost:4200` (Angular dev server).

## Environment

- **Port**: 3000
- **Database**: SQLite (file-based)
- **Framework**: Express.js
- **Node.js**: 14+ recommended
