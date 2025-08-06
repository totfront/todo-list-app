import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('completionChart') private chartRef!: ElementRef;
  private chart!: Chart;
  private todosSubscription!: Subscription;

  allTodos: Todo[] = [];
  filteredTodos: Todo[] = [];
  newTodoTitle: string = '';
  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  isLoading: boolean = true;
  fetchError: string = '';

  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.fetchError = '';
    this.todosSubscription = this.todoService.getTodos().subscribe({
      next: (todos) => {
        console.log('Component: Received todos update:', todos);
        this.allTodos = todos;
        this.applyFilter();
        this.isLoading = false;
        this.fetchError = ''; // Clear any previous errors
      },
      error: (error) => {
        console.error('Component: Error loading todos:', error);

        // Handle different types of errors
        if (error.status === 0 || error.statusText === 'Unknown Error') {
          // Network error - server not reachable
          this.fetchError =
            '🔌 Cannot connect to server. Please check if the backend is running.';
        } else if (error.status === 500) {
          // Server error
          this.fetchError = '⚠️ Server error occurred. Please try again.';
        } else if (error.status === 404) {
          // Not found
          this.fetchError = '📄 Resource not found.';
        } else if (error.error?.message) {
          // Backend error with message
          this.fetchError = `❌ ${error.error.message}`;
        } else if (error.message) {
          // Other error with message
          this.fetchError = `❌ ${error.message}`;
        } else {
          // Generic error
          this.fetchError = '❌ An unexpected error occurred.';
        }

        this.isLoading = false;
      },
    });
  }

  retryLoad(): void {
    this.loadTodos();
  }

  private showOperationError(operation: string, error: any): void {
    let errorMessage = '';

    if (error.status === 0 || error.statusText === 'Unknown Error') {
      errorMessage = `🔌 Cannot ${operation}. Server is not reachable.`;
    } else if (error.status === 500) {
      errorMessage = `⚠️ Failed to ${operation}. Server error occurred.`;
    } else if (error.error?.message) {
      errorMessage = `❌ Failed to ${operation}: ${error.error.message}`;
    } else if (error.message) {
      errorMessage = `❌ Failed to ${operation}: ${error.message}`;
    } else {
      errorMessage = `❌ Failed to ${operation}. Please try again.`;
    }

    // For now, just log the error. You could add a toast notification here
    console.error(errorMessage);
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.todosSubscription) {
      this.todosSubscription.unsubscribe();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  applyFilter(): void {
    if (this.currentFilter === 'pending') {
      this.filteredTodos = this.allTodos
        .sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        )
        .filter((todo) => !todo.completed);
    }
    if (this.currentFilter === 'completed') {
      this.filteredTodos = this.allTodos
        .sort(
          (a, b) =>
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        )
        .filter((todo) => todo.completed);
    }
    if (this.currentFilter === 'all') {
      this.filteredTodos = [...this.allTodos].sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );
    }
    this.updateSummaryAndChart();
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  addTask(): void {
    if (this.newTodoTitle.trim()) {
      console.log('Adding todo:', this.newTodoTitle.trim());
      this.todoService.addTodo(this.newTodoTitle.trim()).subscribe({
        next: (newTodo) => {
          console.log('Todo added successfully:', newTodo);
          this.newTodoTitle = '';
          this.loadTodos(); // Refresh todos after adding
        },
        error: (error) => {
          console.error('Error adding todo:', error);
          this.showOperationError('adding todo', error);
        },
      });
    }
  }

  toggleCompletion(id: number): void {
    this.todoService.toggleTodoCompletion(id).subscribe({
      next: () => {
        this.loadTodos(); // Refresh todos after toggling
      },
      error: (error) => {
        console.error('Error toggling todo:', error);
        this.showOperationError('toggle todo completion', error);
      },
    });
  }

  deleteTask(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.loadTodos(); // Refresh todos after deleting
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
        this.showOperationError('delete todo', error);
      },
    });
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }

  updateSummaryAndChart(): void {
    this.totalTasks = this.allTodos.length;
    this.completedTasks = this.allTodos.filter((todo) => todo.completed).length;
    this.pendingTasks = this.totalTasks - this.completedTasks;

    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.completedTasks,
        this.pendingTasks,
      ];
      this.chart?.update('none');
    }
  }

  createChart(): void {
    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Check if chart element exists
    if (!this.chartRef?.nativeElement) {
      console.warn('Chart element not found');
      return;
    }

    const completedColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--completed-color')
      .trim();
    const pendingColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--pending-color')
      .trim();

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Completed:', 'Pending:'],
        datasets: [
          {
            data: [this.completedTasks, this.pendingTasks],
            backgroundColor: [completedColor, pendingColor],
            borderColor: ['#FFFFFF'],
            borderWidth: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            position: 'nearest',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function (context) {
                const value = context.parsed;
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const percentage =
                  total > 0 ? Math.round((value / total) * 100) : 0;
                return `${value} (${percentage}%)`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          },
        },
      },
    });
    this.updateSummaryAndChart();
  }
}
