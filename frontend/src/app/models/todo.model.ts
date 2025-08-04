export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTodoDto {
  title: string;
  order?: number;
}

export interface UpdateTodoDto {
  title?: string;
  completed?: boolean;
  order?: number;
}
