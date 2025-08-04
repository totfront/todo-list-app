import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Todo } from "./todo.entity";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todosRepository.find({
      order: { order: "ASC" },
    });
  }

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    // Get the next order number
    const count = await this.todosRepository.count();
    const todo = this.todosRepository.create({
      ...createTodoDto,
      order: createTodoDto.order || count + 1,
    });

    return this.todosRepository.save(todo);
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    await this.todosRepository.update(id, updateTodoDto);
    const updated = await this.todosRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error("Todo not found");
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.todosRepository.delete(id);
  }

  async toggleCompletion(id: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new Error("Todo not found");
    }

    todo.completed = !todo.completed;
    return this.todosRepository.save(todo);
  }

  async reorderTodos(todos: Todo[]): Promise<Todo[]> {
    // Use a transaction for better performance
    await this.todosRepository.manager.transaction(async (manager) => {
      for (let i = 0; i < todos.length; i++) {
        await manager.update(Todo, todos[i].id, { order: i + 1 });
      }
    });

    return this.findAll();
  }
}
