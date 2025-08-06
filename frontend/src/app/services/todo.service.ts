import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'http://localhost:3000/todos';

  constructor(private http: HttpClient) {
    // Don't auto-load todos - let components handle when to load
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  addTodo(title: string): Observable<Todo> {
    const createTodoDto: CreateTodoDto = { title };
    return this.http.post<Todo>(this.apiUrl, createTodoDto);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleTodoCompletion(id: number): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/toggle`, {});
  }

  updateTodo(id: number, updateDto: UpdateTodoDto): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}`, updateDto);
  }
}
