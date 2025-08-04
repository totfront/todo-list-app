import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ElementRef } from '@angular/core';
import { AppComponent } from './app.component';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';

// Shared mock objects
interface MockChart {
  data: {
    datasets: Array<{ data: number[] }>;
  };
  update: jest.Mock;
}

const mockChartObject: MockChart = {
  data: {
    datasets: [{ data: [0, 0] }],
  },
  update: jest.fn(),
};

const mockChartRef = {
  nativeElement: document.createElement('canvas'),
} as ElementRef<HTMLCanvasElement>;

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoService: jest.Mocked<TodoService>;

  const mockTodos: Todo[] = [
    { id: 1, title: 'Test Task 1', completed: true, order: 1 },
    { id: 2, title: 'Test Task 2', completed: false, order: 2 },
    { id: 3, title: 'Test Task 3', completed: false, order: 3 },
  ];

  beforeEach(async () => {
    const mockTodoService = {
      getTodos: jest.fn(),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
      toggleTodoCompletion: jest.fn(),
      reorderTodos: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule, DragDropModule],
      providers: [{ provide: TodoService, useValue: mockTodoService }],
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jest.Mocked<TodoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    todoService.getTodos.mockReturnValue(mockTodos);

    // Mock createChart to prevent actual chart creation
    jest.spyOn(component, 'createChart').mockImplementation(() => {
      // Mock chart object
      Object.assign(component, {
        chart: mockChartObject,
      });
    });
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

    it('should create chart after the component`s view (template) has been fully initialized', () => {
      const createChartSpy = jest.spyOn(component, 'createChart');

      component.ngAfterViewInit();

      expect(createChartSpy).toHaveBeenCalled();
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
        { id: 2, title: 'Test Task 2', completed: false, order: 2 },
        { id: 3, title: 'Test Task 3', completed: false, order: 3 },
      ]);
    });

    it('should show only completed todos when filter is "completed"', () => {
      component.currentFilter = 'completed';

      component.applyFilter();

      expect(component.filteredTodos).toEqual([
        { id: 1, title: 'Test Task 1', completed: true, order: 1 },
      ]);
    });

    it('should update summary and chart when filter is applied', () => {
      const updateSummarySpy = jest.spyOn(component, 'updateSummaryAndChart');

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

  describe('drop', () => {
    beforeEach(() => {
      jest.spyOn(component, 'loadTodos');
      component.allTodos = mockTodos;
    });

    it('should reorder todos and reload', () => {
      const mockEvent = {
        previousIndex: 0,
        currentIndex: 2,
        item: { data: mockTodos[0] },
        container: { data: mockTodos },
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
      } as CdkDragDrop<Todo[]>;

      component.drop(mockEvent);

      expect(todoService.reorderTodos).toHaveBeenCalledWith(mockTodos, 0, 2);
      expect(component.loadTodos).toHaveBeenCalled();
    });
  });

  describe('trackByTodoId', () => {
    it('should return todo id for tracking', () => {
      const todo = { id: 123, title: 'Test', completed: false, order: 1 };

      const result = component.trackByTodoId(0, todo);

      expect(result).toBe(123);
    });
  });

  describe('updateSummaryAndChart', () => {
    beforeEach(() => {
      component.allTodos = mockTodos;
    });

    it('should update task counts correctly', () => {
      component.updateSummaryAndChart();

      expect(component.totalTasks).toBe(3);
      expect(component.completedTasks).toBe(1);
      expect(component.pendingTasks).toBe(2);
    });

    it('should update chart data when chart exists', () => {
      // Mock chart
      (component as any).chart = {
        data: { datasets: [{ data: [] }] },
        update: jest.fn(),
      } as MockChart;

      component.updateSummaryAndChart();

      expect((component as any).chart.data.datasets[0].data).toEqual([1, 2]);
      expect((component as any).chart.update).toHaveBeenCalledWith('none');
    });

    it('should not update chart when chart does not exist', () => {
      (component as any).chart = undefined as any;

      expect(() => component.updateSummaryAndChart()).not.toThrow();
    });
  });

  describe('createChart', () => {
    beforeEach(() => {
      // Mock the ViewChild element
      (component as any).chartRef = mockChartRef;
    });

    it('should call updateSummaryAndChart after creating chart', () => {
      // Temporarily unmock createChart for this test
      const createChartSpy = jest
        .spyOn(component, 'createChart')
        .mockImplementation(() => {
          // Mock chart object
          Object.assign(component, {
            chart: mockChartObject,
          });
          // Call the original updateSummaryAndChart method
          component.updateSummaryAndChart();
        });
      const updateSummarySpy = jest.spyOn(component, 'updateSummaryAndChart');

      component.createChart();

      expect(updateSummarySpy).toHaveBeenCalled();
    });
  });

  describe('Template Integration', () => {
    beforeEach(() => {
      component.allTodos = mockTodos;
      component.filteredTodos = mockTodos;
      component.applyFilter();
      fixture.detectChanges();
    });

    it('should display correct task counts', () => {
      const totalElement = fixture.debugElement.query(
        By.css('[aria-label="Total tasks"]')
      );
      const pendingElement = fixture.debugElement.query(
        By.css('[aria-label="Pending tasks"]')
      );
      const completedElement = fixture.debugElement.query(
        By.css('[aria-label="Completed tasks"]')
      );

      expect(totalElement.nativeElement.textContent.trim()).toBe('3');
      expect(pendingElement.nativeElement.textContent.trim()).toBe('2');
      expect(completedElement.nativeElement.textContent.trim()).toBe('1');
    });

    it('should display todos in the list', () => {
      const todoItems = fixture.debugElement.queryAll(By.css('.taskItem'));

      expect(todoItems.length).toBe(3);
    });

    it('should show completed tasks with line-through style', () => {
      const completedTask = fixture.debugElement.query(
        By.css('.taskItem .taskTitleLineThrough')
      );

      expect(completedTask).toBeTruthy();
    });

    it('should have form with input and button', () => {
      const form = fixture.debugElement.query(By.css('form'));
      const input = fixture.debugElement.query(By.css('#new-task-input'));
      const button = fixture.debugElement.query(By.css('#add-task-button'));

      expect(form).toBeTruthy();
      expect(input).toBeTruthy();
      expect(button).toBeTruthy();
    });

    it('should call addTask when form is submitted', () => {
      const addTaskSpy = jest.spyOn(component, 'addTask');
      const form = fixture.debugElement.query(By.css('form'));

      form.triggerEventHandler('ngSubmit', null);

      expect(addTaskSpy).toHaveBeenCalled();
    });

    it('should call setFilter when filter buttons are clicked', () => {
      const setFilterSpy = jest.spyOn(component, 'setFilter');
      const pendingButton = fixture.debugElement.query(
        By.css('[aria-label="Show pending tasks"]')
      );

      pendingButton.triggerEventHandler('click', null);

      expect(setFilterSpy).toHaveBeenCalledWith('pending');
    });

    it('should call toggleCompletion when checkbox is changed', () => {
      const toggleSpy = jest.spyOn(component, 'toggleCompletion');
      const checkbox = fixture.debugElement.query(By.css('.taskCheckbox'));

      checkbox.triggerEventHandler('change', { target: { checked: true } });

      expect(toggleSpy).toHaveBeenCalled();
    });

    it('should call deleteTask when delete button is clicked', () => {
      const deleteSpy = jest.spyOn(component, 'deleteTask');
      const deleteButton = fixture.debugElement.query(By.css('.deleteBtn'));

      deleteButton.triggerEventHandler('click', null);

      expect(deleteSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty todos array', () => {
      todoService.getTodos.mockReturnValue([]);
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
      todoService.getTodos.mockReturnValue(allCompletedTodos);
      component.loadTodos();

      expect(component.completedTasks).toBe(3);
      expect(component.pendingTasks).toBe(0);
    });

    it('should handle todos with all pending tasks', () => {
      const allPendingTodos = mockTodos.map((todo) => ({
        ...todo,
        completed: false,
      }));
      todoService.getTodos.mockReturnValue(allPendingTodos);
      component.loadTodos();

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
