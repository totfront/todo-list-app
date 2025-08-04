import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodosModule } from "./todos/todos.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "todos.db",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true, // Only for development
    }),
    TodosModule,
  ],
})
export class AppModule {}
