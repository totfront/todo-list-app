import { Injectable } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Set up interactive dashboard structure',
      completed: true,
      order: 1,
    },
    {
      id: 2,
      title: 'Implement dynamic summary widgets',
      completed: true,
      order: 2,
    },
    {
      id: 3,
      title: 'Add task creation functionality',
      completed: false,
      order: 3,
    },
    {
      id: 4,
      title: 'Enable task filtering and completion',
      completed: false,
      order: 4,
    },
    {
      id: 5,
      title: 'Implement drag-and-drop reordering',
      completed: false,
      order: 5,
    },
  ];

  constructor() {}

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: Date.now(),
      title: title,
      completed: false,
      order: this.todos.length + 1,
    };
    this.todos.unshift(newTodo);
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  toggleTodoCompletion(id: number): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  reorderTodos(
    todos: Todo[],
    previousIndex: number,
    currentIndex: number
  ): void {
    moveItemInArray(todos, previousIndex, currentIndex);
  }
}
