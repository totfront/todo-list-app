import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return initial todos', () => {
    const todos = service.getTodos();
    expect(todos).toBeDefined();
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeGreaterThan(0);
  });

  it('should add a new todo', () => {
    const initialTodos = service.getTodos();
    const initialLength = initialTodos.length;
    const newTodoTitle = 'New Test Todo';

    service.addTodo(newTodoTitle);

    const updatedTodos = service.getTodos();
    expect(updatedTodos.length).toBe(initialLength + 1);
    expect(updatedTodos[0].title).toBe(newTodoTitle);
    expect(updatedTodos[0].completed).toBe(false);
  });

  it('should delete a todo', () => {
    const initialTodos = service.getTodos();
    const todoToDelete = initialTodos[0];
    const initialLength = initialTodos.length;

    service.deleteTodo(todoToDelete.id);

    const updatedTodos = service.getTodos();
    expect(updatedTodos.length).toBe(initialLength - 1);
    expect(
      updatedTodos.find((todo) => todo.id === todoToDelete.id)
    ).toBeUndefined();
  });

  it('should toggle todo completion', () => {
    const todos = service.getTodos();
    const todoToToggle = todos.find((todo) => !todo.completed);

    if (todoToToggle) {
      const initialStatus = todoToToggle.completed;
      service.toggleTodoCompletion(todoToToggle.id);

      const updatedTodos = service.getTodos();
      const updatedTodo = updatedTodos.find(
        (todo) => todo.id === todoToToggle.id
      );
      expect(updatedTodo?.completed).toBe(!initialStatus);
    }
  });
});
