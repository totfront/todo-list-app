import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TodosService } from "./todos.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { Todo } from "./todo.entity";

@Controller("todos")
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTodoDto: UpdateTodoDto
  ): Promise<Todo> {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Patch(":id/toggle")
  toggleCompletion(@Param("id") id: string): Promise<Todo> {
    return this.todosService.toggleCompletion(+id);
  }

  @Post("reorder")
  reorderTodos(@Body() todos: Todo[]): Promise<Todo[]> {
    return this.todosService.reorderTodos(todos);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string): Promise<void> {
    return this.todosService.remove(+id);
  }
}
