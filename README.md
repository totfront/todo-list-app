# Todo List Application

A modern, full-stack todo list application built with Angular frontend and Express.js backend. Features a clean, responsive interface with real-time data management and comprehensive error handling.

## 🚀 Features

### ✨ Core Functionality

- **Task Management** - Add, toggle, and delete todos with ease
- **Smart Filtering** - Filter by all, pending, or completed tasks
- **Real-time Updates** - Automatic data refresh after operations
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Error Handling** - Graceful error handling with retry functionality
- **Loading States** - Clear feedback during data operations

### 🎨 User Experience

- **Clean Interface** - Modern, intuitive design
- **Clickable Todos** - Entire todo item is clickable for completion
- **Visual Feedback** - Smooth interactions and state changes
- **Accessibility** - ARIA labels and keyboard navigation support

## 🏗️ Project Structure

```
todo-list-app/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts      # Main application component
│   │   │   ├── app.component.html    # Main template
│   │   │   ├── app.component.css     # Main styles
│   │   │   ├── models/
│   │   │   │   └── todo.model.ts     # Todo interface and DTOs
│   │   │   └── services/
│   │   │       └── todo.service.ts   # HTTP service for API communication
│   │   ├── main.ts                   # Application entry point
│   │   └── styles.css                # Global styles
│   ├── package.json
│   └── README.md
├── backend/                  # Express.js API server
│   ├── server.js             # Main server file
│   ├── todos.db              # SQLite database (auto-generated)
│   ├── package.json
│   └── README.md
└── README.md                 # This file
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Angular 20.1.0
- **HTTP Client**: Angular HttpClient
- **Testing**: Jest
- **E2E Testing**: Cypress
- **Styling**: CSS with modern features

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **CORS**: Cross-origin resource sharing enabled
- **Validation**: Built-in request validation

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-list-app
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:4200`

## 📡 API Endpoints

| Method   | Endpoint            | Description                              |
| -------- | ------------------- | ---------------------------------------- |
| `GET`    | `/todos`            | Get all todos (ordered by creation date) |
| `POST`   | `/todos`            | Create a new todo                        |
| `PATCH`  | `/todos/:id`        | Update a todo                            |
| `PATCH`  | `/todos/:id/toggle` | Toggle todo completion                   |
| `DELETE` | `/todos/:id`        | Delete a todo                            |
| `GET`    | `/health`           | Health check endpoint                    |
| `GET`    | `/todos/test-error` | Test error endpoint                      |

### Request/Response Examples

#### Create Todo

```bash
POST /todos
Content-Type: application/json

{
  "title": "Buy groceries"
}
```

#### Toggle Todo

```bash
PATCH /todos/1/toggle
```

## 🗄️ Database Schema

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test                    # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
npm run e2e               # Run end-to-end tests
```

### Backend Tests

```bash
cd backend
npm test                   # Run tests (when implemented)
```

## 🚀 Development Scripts

### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests
- `npm run e2e` - Run end-to-end tests

### Backend

- `npm run dev` - Start development server with auto-restart
- `npm start` - Start production server

## 🔧 Configuration

### Environment Variables

The application uses default configurations, but you can customize:

#### Backend

- **Port**: 3000 (default)
- **Database**: SQLite file (`todos.db`)
- **CORS**: Enabled for `http://localhost:4200`

#### Frontend

- **API URL**: `http://localhost:3000/todos`
- **Port**: 4200 (default)

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Error**

   - Ensure backend server is running on port 3000
   - Check if port 3000 is available

2. **Frontend Build Errors**

   - Clear `node_modules` and reinstall dependencies
   - Check Node.js version compatibility

3. **Database Issues**
   - Delete `todos.db` file to reset database
   - Check file permissions

### Error Messages

- 🔌 **Server Connection** - Backend server is not reachable
- ⚠️ **Server Error** - Backend encountered an error
- 📄 **Not Found** - Requested resource doesn't exist
- ❌ **Validation Error** - Invalid data provided

## 📈 Performance

- **Frontend**: Optimized bundle with tree shaking
- **Backend**: Lightweight Express.js server
- **Database**: SQLite for fast local development
- **Network**: Efficient HTTP communication

## 🔒 Security

- **Input Validation** - Server-side validation for all requests
- **CORS Protection** - Configured for specific origins
- **SQL Injection Prevention** - Parameterized queries
- **Error Handling** - No sensitive information in error messages

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow Angular style guide for frontend
- Use consistent code formatting
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 🎯 Roadmap

### Planned Features

- User authentication and authorization
- Real-time updates with WebSockets
- Dark mode theme
- Mobile app (PWA)
- Advanced filtering and search
- Todo categories and tags

### Technical Improvements

- TypeScript migration for backend
- Enhanced testing coverage
- Performance optimizations
- Security enhancements
- Monitoring and logging

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Angular](https://angular.dev/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [SQLite](https://www.sqlite.org/) - Database
- [Jest](https://jestjs.io/) - Testing framework
- [Cypress](https://docs.cypress.io/) - E2E testing
