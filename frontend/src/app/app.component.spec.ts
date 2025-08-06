import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoService: jest.Mocked<TodoService>;

  const mockTodos: Todo[] = [
    {
      id: 1,
      title: 'Test Task 1',
      completed: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 2,
      title: 'Test Task 2',
      completed: false,
      createdAt: new Date('2024-01-02T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
    },
    {
      id: 3,
      title: 'Test Task 3',
      completed: false,
      createdAt: new Date('2024-01-03T00:00:00Z'),
      updatedAt: new Date('2024-01-03T00:00:00Z'),
    },
  ];

  beforeEach(async () => {
    const mockTodoService = {
      getTodos: jest.fn().mockReturnValue(of(mockTodos)),
      addTodo: jest.fn().mockReturnValue(of(mockTodos[0])),
      deleteTodo: jest.fn().mockReturnValue(of(void 0)),
      toggleTodoCompletion: jest.fn().mockReturnValue(of(mockTodos[0])),
      updateTodo: jest.fn().mockReturnValue(of(mockTodos[0])),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jest.Mocked<TodoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should exist', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.allTodos).toEqual([]);
      expect(component.filteredTodos).toEqual([]);
      expect(component.newTodoTitle).toBe('');
      expect(component.currentFilter).toBe('all');
      expect(component.totalTasks).toBe(0);
      expect(component.completedTasks).toBe(0);
      expect(component.pendingTasks).toBe(0);
    });

    it('should load todos after the component has been initialized', () => {
      component.ngOnInit();

      expect(todoService.getTodos).toHaveBeenCalled();
      expect(component.allTodos).toEqual(mockTodos);
    });
  });

  describe('loadTodos', () => {
    it('should load todos from service and apply filter', () => {
      const applyFilterSpy = jest.spyOn(component, 'applyFilter');

      component.loadTodos();

      expect(todoService.getTodos).toHaveBeenCalled();
      expect(component.allTodos).toEqual(mockTodos);
      expect(applyFilterSpy).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    beforeEach(() => {
      component.allTodos = mockTodos;
    });

    it('should show all todos when filter is "all"', () => {
      component.currentFilter = 'all';

      component.applyFilter();

      expect(component.filteredTodos).toEqual(mockTodos);
    });

    it('should show only pending todos when filter is "pending"', () => {
      component.currentFilter = 'pending';

      component.applyFilter();

      expect(component.filteredTodos).toEqual([
        {
          id: 2,
          title: 'Test Task 2',
          completed: false,
          createdAt: new Date('2024-01-02T00:00:00Z'),
          updatedAt: new Date('2024-01-02T00:00:00Z'),
        },
        {
          id: 3,
          title: 'Test Task 3',
          completed: false,
          createdAt: new Date('2024-01-03T00:00:00Z'),
          updatedAt: new Date('2024-01-03T00:00:00Z'),
        },
      ]);
    });

    it('should show only completed todos when filter is "completed"', () => {
      component.currentFilter = 'completed';

      component.applyFilter();

      expect(component.filteredTodos).toEqual([
        {
          id: 1,
          title: 'Test Task 1',
          completed: true,
          createdAt: new Date('2024-01-01T00:00:00Z'),
          updatedAt: new Date('2024-01-01T00:00:00Z'),
        },
      ]);
    });

    it('should update summary when filter is applied', () => {
      const updateSummarySpy = jest.spyOn(component, 'updateSummary');

      component.applyFilter();

      expect(updateSummarySpy).toHaveBeenCalled();
    });
  });

  describe('setFilter', () => {
    it('should update current filter and apply it', () => {
      const applyFilterSpy = jest.spyOn(component, 'applyFilter');

      component.setFilter('pending');

      expect(component.currentFilter).toBe('pending');
      expect(applyFilterSpy).toHaveBeenCalled();
    });

    it('should handle all filter types', () => {
      component.setFilter('all');
      expect(component.currentFilter).toBe('all');

      component.setFilter('pending');
      expect(component.currentFilter).toBe('pending');

      component.setFilter('completed');
      expect(component.currentFilter).toBe('completed');
    });
  });

  describe('addTask', () => {
    beforeEach(() => {
      jest.spyOn(component, 'loadTodos');
    });

    it('should add task when title is not empty', () => {
      component.newTodoTitle = 'New Task';

      component.addTask();

      expect(todoService.addTodo).toHaveBeenCalledWith('New Task');
      expect(component.newTodoTitle).toBe('');
      expect(component.loadTodos).toHaveBeenCalled();
    });

    it('should not add task when title is empty', () => {
      component.newTodoTitle = '';

      component.addTask();

      expect(todoService.addTodo).not.toHaveBeenCalled();
      expect(component.loadTodos).not.toHaveBeenCalled();
    });

    it('should not add task when title is only whitespace', () => {
      component.newTodoTitle = '   ';

      component.addTask();

      expect(todoService.addTodo).not.toHaveBeenCalled();
      expect(component.loadTodos).not.toHaveBeenCalled();
    });

    it('should trim whitespace from task title', () => {
      component.newTodoTitle = '  New Task  ';

      component.addTask();

      expect(todoService.addTodo).toHaveBeenCalledWith('New Task');
    });
  });

  describe('toggleCompletion', () => {
    beforeEach(() => {
      jest.spyOn(component, 'loadTodos');
    });

    it('should toggle todo completion and reload todos', () => {
      component.toggleCompletion(1);

      expect(todoService.toggleTodoCompletion).toHaveBeenCalledWith(1);
      expect(component.loadTodos).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    beforeEach(() => {
      jest.spyOn(component, 'loadTodos');
    });

    it('should delete todo and reload todos', () => {
      component.deleteTask(1);

      expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
      expect(component.loadTodos).toHaveBeenCalled();
    });
  });

  describe('trackByTodoId', () => {
    it('should return todo id for tracking', () => {
      const todo = {
        id: 123,
        title: 'Test',
        completed: false,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      };

      const result = component.trackByTodoId(0, todo);

      expect(result).toBe(123);
    });
  });

  describe('updateSummary', () => {
    beforeEach(() => {
      component.allTodos = mockTodos;
    });

    it('should update task counts correctly', () => {
      component.updateSummary();

      expect(component.totalTasks).toBe(3);
      expect(component.completedTasks).toBe(1);
      expect(component.pendingTasks).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty todos array', () => {
      todoService.getTodos.mockReturnValue(of([]));
      component.loadTodos();

      expect(component.totalTasks).toBe(0);
      expect(component.completedTasks).toBe(0);
      expect(component.pendingTasks).toBe(0);
    });

    it('should handle todos with all completed tasks', () => {
      const allCompletedTodos = mockTodos.map((todo) => ({
        ...todo,
        completed: true,
      }));
      todoService.getTodos.mockReturnValue(of(allCompletedTodos));
      component.loadTodos();

      expect(component.totalTasks).toBe(3);
      expect(component.completedTasks).toBe(3);
      expect(component.pendingTasks).toBe(0);
    });

    it('should handle todos with all pending tasks', () => {
      const allPendingTodos = mockTodos.map((todo) => ({
        ...todo,
        completed: false,
      }));
      todoService.getTodos.mockReturnValue(of(allPendingTodos));
      component.loadTodos();

      expect(component.totalTasks).toBe(3);
      expect(component.completedTasks).toBe(0);
      expect(component.pendingTasks).toBe(3);
    });

    it('should handle filter with no matching todos', () => {
      component.allTodos = mockTodos;
      component.currentFilter = 'completed';

      // Filter for completed tasks when none exist
      component.allTodos = mockTodos.filter((todo) => !todo.completed);
      component.applyFilter();

      expect(component.filteredTodos).toEqual([]);
    });
  });
});
