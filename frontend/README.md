# Todo List Frontend

A modern Angular application for managing todo tasks with real-time data visualization and filtering capabilities.

## Features

- ✅ **Task Management**: Add, toggle, and delete todos

- 🔍 **Smart Filtering**: Filter by all, pending, or completed tasks
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Updates**: Automatic data refresh after operations
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations
- 🔄 **Error Handling**: Graceful error handling with retry functionality

## Tech Stack

- **Framework**: Angular 20.1.0
- **HTTP Client**: Angular HttpClient
- **Testing**: Jest
- **E2E Testing**: Cypress

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on `http://localhost:3000`

## Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

## Development

### Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200/`. The page will automatically reload when you make changes to the source files.

### Development Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run watch` - Build and watch for changes
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run e2e` - Run end-to-end tests with Cypress
- `npm run e2e:open` - Open Cypress test runner

## Project Structure

```
src/
├── app/
│   ├── app.component.ts          # Main application component
│   ├── app.component.html        # Main template
│   ├── app.component.css         # Main styles
│   ├── app.component.spec.ts     # Main component tests
│   ├── models/
│   │   └── todo.model.ts         # Todo interface and DTOs
│   └── services/
│       ├── todo.service.ts       # HTTP service for todo operations
│       └── todo.service.spec.ts  # Service tests
├── main.ts                       # Application entry point
├── styles.css                    # Global scope styles
└── index.html                    # Main HTML file
```

## API Integration

The frontend communicates with the backend via REST API:

- `GET /todos` - Fetch all todos
- `POST /todos` - Create new todo
- `PATCH /todos/:id` - Update todo
- `PATCH /todos/:id/toggle` - Toggle todo completion
- `DELETE /todos/:id` - Delete todo

## Key Components

### AppComponent

- Main application component handling todo management
- Filtering and sorting functionality
- Error handling and loading states

### TodoService

- HTTP service for backend communication
- Handles all CRUD operations
- Returns RxJS Observables for reactive data flow

## Testing

### Unit Tests

```bash
npm test
```

Tests are written using Jest and cover:

- Component functionality
- Service methods
- Template interactions

### E2E Tests

```bash
npm run e2e
```

End-to-end tests using Cypress cover:

- User workflows
- API integration
- UI interactions

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory, optimized for production deployment.

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Ensure the backend server is running on port 3000
2. **Tests Failing**: Verify all dependencies are installed correctly

### Error Messages

- 🔌 **Server Connection**: Backend server is not reachable
- ⚠️ **Server Error**: Backend encountered an error
- 📄 **Not Found**: Requested resource doesn't exist
- ❌ **Validation Error**: Invalid data provided

## Contributing

1. Follow Angular style guide
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Jest Testing Framework](https://jestjs.io/)
- [Cypress E2E Testing](https://docs.cypress.io/)
