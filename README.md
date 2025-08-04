# Todo List Application

A full-stack todo list application with Angular frontend and NestJS backend.

## Project Structure

```
todo-list-app/
├── frontend/          # Angular application
│   ├── src/
│   │   └── app/
│   │       ├── app.component.ts
│   │       ├── services/
│   │       └── models/
│   └── package.json
├── backend/           # NestJS API server
│   ├── src/
│   │   ├── todos/
│   │   │   ├── todos.controller.ts
│   │   │   ├── todos.service.ts
│   │   │   └── todo.entity.ts
│   │   └── main.ts
│   └── package.json
└── README.md
```

## Features

### Frontend (Angular)

- Interactive todo dashboard
- Add, edit, delete todos
- Mark todos as complete/incomplete
- Drag and drop reordering
- Filter todos (all, pending, completed)
- Real-time statistics and charts
- Responsive design

### Backend (NestJS)

- RESTful API
- SQLite database with TypeORM
- Input validation
- CORS enabled for frontend
- Full CRUD operations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will be available at `http://localhost:4200`

## API Endpoints

- `GET /todos` - Get all todos
- `GET /todos/:id` - Get a specific todo
- `POST /todos` - Create a new todo
- `PATCH /todos/:id` - Update a todo
- `PATCH /todos/:id/toggle` - Toggle todo completion
- `POST /todos/reorder` - Reorder todos
- `DELETE /todos/:id` - Delete a todo

## Development

### Backend

```bash
cd backend
npm run start:dev    # Development with hot reload
npm run build        # Build for production
npm run test         # Run tests
```

### Frontend

```bash
cd frontend
npm start            # Development server
npm run build        # Build for production
npm run test         # Run tests
```

## Technologies Used

### Frontend

- Angular 17
- TypeScript
- Chart.js
- Angular CDK (Drag & Drop)
- Jest for testing

### Backend

- NestJS
- TypeScript
- TypeORM
- SQLite
- class-validator
- Jest for testing

## Database

The application uses SQLite for data persistence. The database file (`todos.db`) is automatically created in the backend directory when you first run the application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
