import { IsString, IsNotEmpty, IsOptional, IsNumber } from "class-validator";

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
