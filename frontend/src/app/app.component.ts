import { Component } from '@angular/core';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';

@Component({
  selector: 'app-root',
  template: '<app-task-dashboard></app-task-dashboard>',
  imports: [TaskDashboardComponent],
  standalone: true,
})
export class AppComponent {
  title = 'todo-list-app';
}
