import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Chart, registerables } from 'chart.js';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

Chart.register(...registerables);

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
})
export class TaskDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('completionChart') private chartRef!: ElementRef;
  private chart!: Chart;

  allTodos: Todo[] = [];
  filteredTodos: Todo[] = [];
  newTodoTitle: string = '';
  currentFilter: 'all' | 'pending' | 'completed' = 'all';

  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  loadTodos(): void {
    this.allTodos = this.todoService.getTodos();
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.currentFilter === 'pending') {
      this.filteredTodos = this.allTodos.filter((todo) => !todo.completed);
    }
    if (this.currentFilter === 'completed') {
      this.filteredTodos = this.allTodos.filter((todo) => todo.completed);
    }
    if (this.currentFilter === 'all') {
      this.filteredTodos = [...this.allTodos];
    }
    this.updateSummaryAndChart();
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  addTask(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle.trim());
      this.newTodoTitle = '';
      this.loadTodos();
    }
  }

  toggleCompletion(id: number): void {
    this.todoService.toggleTodoCompletion(id);
    this.loadTodos();
  }

  deleteTask(id: number): void {
    this.todoService.deleteTodo(id);
    this.loadTodos();
  }

  drop(event: CdkDragDrop<Todo[]>): void {
    this.todoService.reorderTodos(
      this.allTodos,
      event.previousIndex,
      event.currentIndex
    );
    this.loadTodos();
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
