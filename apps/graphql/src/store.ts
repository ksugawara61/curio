import type { CreateTodoInput, Todo, UpdateTodoInput } from "./types.js";

class TodoStore {
  private readonly todos: Map<string, Todo> = new Map();
  private currentId = 1;

  getAll(): Todo[] {
    return Array.from(this.todos.values());
  }

  getById(id: string): Todo | undefined {
    return this.todos.get(id);
  }

  create(input: CreateTodoInput): Todo {
    const id = String(this.currentId++);
    const todo: Todo = {
      id,
      title: input.title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.todos.set(id, todo);
    return todo;
  }

  update(input: UpdateTodoInput): Todo | null {
    const todo = this.todos.get(input.id);
    if (!todo) {
      return null;
    }

    const updated: Todo = {
      ...todo,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.completed !== undefined && { completed: input.completed }),
    };

    this.todos.set(input.id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.todos.delete(id);
  }

  clear(): void {
    this.todos.clear();
    this.currentId = 1;
  }
}

export const todoStore = new TodoStore();
