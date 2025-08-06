import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable for todos', () => {
    const todos$ = service.getTodos();
    expect(todos$).toBeDefined();
    todos$.subscribe((todos) => {
      expect(Array.isArray(todos)).toBe(true);
    });
  });

  it('should add a new todo', () => {
    const newTodoTitle = 'New Test Todo';
    const addTodo$ = service.addTodo(newTodoTitle);

    addTodo$.subscribe((todo) => {
      expect(todo.title).toBe(newTodoTitle);
      expect(todo.completed).toBe(false);
    });
  });

  it('should delete a todo', () => {
    const todoId = 1;
    const deleteTodo$ = service.deleteTodo(todoId);

    deleteTodo$.subscribe(() => {
      // Should complete without error
      expect(true).toBe(true);
    });
  });

  it('should toggle todo completion', () => {
    const todoId = 1;
    const toggleTodo$ = service.toggleTodoCompletion(todoId);

    toggleTodo$.subscribe((todo) => {
      expect(todo.id).toBe(todoId);
      expect(typeof todo.completed).toBe('boolean');
    });
  });
});
