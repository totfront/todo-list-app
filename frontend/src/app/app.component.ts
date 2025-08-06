import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from './models/todo.model';
import { TodoService } from './services/todo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AppComponent implements OnInit, OnDestroy {
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
        this.allTodos = todos;
        this.applyFilter();
        this.isLoading = false;
        this.fetchError = '';
      },
      error: (error) => {
        this.fetchError = this.handleError(error);

        this.isLoading = false;
      },
    });
  }

  retryLoad(): void {
    this.loadTodos();
  }

  private handleError(error: any, operation?: string): string {
    switch (error.status) {
      case 0:
        return operation
          ? `🔌 Cannot ${operation}. Server is not reachable.`
          : '🔌 Cannot connect to server. Please check if the backend is running.';
      case 404:
        return '📄 Resource not found.';
      case 500:
        return operation
          ? `⚠️ Failed to ${operation}. Server error occurred.`
          : '⚠️ Server error occurred. Please try again.';
      default:
        if (error.error?.message) {
          return operation
            ? `❌ Failed to ${operation}: ${error.error.message}`
            : `❌ ${error.error.message}`;
        } else if (error.message) {
          return operation
            ? `❌ Failed to ${operation}: ${error.message}`
            : `❌ ${error.message}`;
        } else {
          return operation
            ? `❌ Failed to ${operation}. Please try again.`
            : '❌ An unexpected error occurred.';
        }
    }
  }

  ngOnDestroy(): void {
    if (this.todosSubscription) {
      this.todosSubscription.unsubscribe();
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
    this.updateSummary();
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  addTask(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle.trim()).subscribe({
        next: (newTodo) => {
          this.newTodoTitle = '';
          this.loadTodos();
        },
        error: (error) => {
          console.error(this.handleError(error, 'adding todo'));
        },
      });
    }
  }

  toggleCompletion(id: number): void {
    this.todoService.toggleTodoCompletion(id).subscribe({
      next: () => {
        this.loadTodos();
      },
      error: (error) => {
        console.error(this.handleError(error, 'toggle todo completion'));
      },
    });
  }

  deleteTask(id: number): void {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.loadTodos();
      },
      error: (error) => {
        console.error(this.handleError(error, 'delete todo'));
      },
    });
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }

  updateSummary(): void {
    this.totalTasks = this.allTodos.length;
    this.completedTasks = this.allTodos.filter((todo) => todo.completed).length;
    this.pendingTasks = this.totalTasks - this.completedTasks;
  }
}
