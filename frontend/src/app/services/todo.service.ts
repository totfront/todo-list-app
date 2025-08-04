import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/todos';
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (todos) => this.todosSubject.next(todos),
      error: (error) => console.error('Error loading todos:', error),
    });
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  addTodo(title: string): Observable<Todo> {
    const createTodoDto: CreateTodoDto = { title };
    return this.http.post<Todo>(this.apiUrl, createTodoDto).pipe(
      tap((newTodo) => {
        const currentTodos = this.todosSubject.value;
        this.todosSubject.next([newTodo, ...currentTodos]);
      })
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTodos = this.todosSubject.value;
        const updatedTodos = currentTodos.filter((todo) => todo.id !== id);
        this.todosSubject.next(updatedTodos);
      })
    );
  }

  toggleTodoCompletion(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
      tap((updatedTodo) => {
        const currentTodos = this.todosSubject.value;
        const updatedTodos = currentTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        this.todosSubject.next(updatedTodos);
      })
    );
  }

  updateTodo(id: number, updateDto: UpdateTodoDto): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}`, updateDto).pipe(
      tap((updatedTodo) => {
        const currentTodos = this.todosSubject.value;
        const updatedTodos = currentTodos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        this.todosSubject.next(updatedTodos);
      })
    );
  }

  reorderTodos(todos: Todo[]): Observable<Todo[]> {
    return this.http.post<Todo[]>(`${this.apiUrl}/reorder`, todos).pipe(
      tap((updatedTodos) => {
        this.todosSubject.next(updatedTodos);
      })
    );
  }

  refreshTodos(): void {
    this.loadTodos();
  }
}
