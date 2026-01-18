import { graphql } from "graphql";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { server } from "../src/index.js";
import { schema } from "../src/schema.js";
import { todoStore } from "../src/store.js";

beforeEach(() => {
  todoStore.clear();
});

afterAll(() => {
  server.close();
});

describe("GraphQL Queries", () => {
  it("should return empty array when no todos exist", async () => {
    const query = `
      query {
        todos {
          id
          title
          completed
        }
      }
    `;

    const result = await graphql({ schema, source: query });
    expect(result.errors).toBeUndefined();
    expect(result.data?.todos).toEqual([]);
  });

  it("should return all todos", async () => {
    todoStore.create({ title: "First todo" });
    todoStore.create({ title: "Second todo" });

    const query = `
      query {
        todos {
          id
          title
          completed
        }
      }
    `;

    const result = await graphql({ schema, source: query });
    expect(result.errors).toBeUndefined();
    expect(result.data?.todos).toHaveLength(2);
    expect(result.data?.todos[0]).toMatchObject({
      id: "1",
      title: "First todo",
      completed: false,
    });
  });

  it("should return a specific todo by id", async () => {
    todoStore.create({ title: "Test todo" });

    const query = `
      query {
        todo(id: "1") {
          id
          title
          completed
          createdAt
        }
      }
    `;

    const result = await graphql({ schema, source: query });
    expect(result.errors).toBeUndefined();
    expect(result.data?.todo).toMatchObject({
      id: "1",
      title: "Test todo",
      completed: false,
    });
    expect(result.data?.todo.createdAt).toBeDefined();
  });

  it("should return null for non-existent todo", async () => {
    const query = `
      query {
        todo(id: "999") {
          id
          title
        }
      }
    `;

    const result = await graphql({ schema, source: query });
    expect(result.errors).toBeUndefined();
    expect(result.data?.todo).toBeNull();
  });
});

describe("GraphQL Mutations", () => {
  it("should create a new todo", async () => {
    const mutation = `
      mutation {
        createTodo(input: { title: "New todo" }) {
          id
          title
          completed
          createdAt
        }
      }
    `;

    const result = await graphql({ schema, source: mutation });
    expect(result.errors).toBeUndefined();
    expect(result.data?.createTodo).toMatchObject({
      id: "1",
      title: "New todo",
      completed: false,
    });
    expect(result.data?.createTodo.createdAt).toBeDefined();
  });

  it("should update todo title", async () => {
    todoStore.create({ title: "Original title" });

    const mutation = `
      mutation {
        updateTodo(input: { id: "1", title: "Updated title" }) {
          id
          title
          completed
        }
      }
    `;

    const result = await graphql({ schema, source: mutation });
    expect(result.errors).toBeUndefined();
    expect(result.data?.updateTodo).toMatchObject({
      id: "1",
      title: "Updated title",
      completed: false,
    });
  });

  it("should update todo completion status", async () => {
    todoStore.create({ title: "Test todo" });

    const mutation = `
      mutation {
        updateTodo(input: { id: "1", completed: true }) {
          id
          title
          completed
        }
      }
    `;

    const result = await graphql({ schema, source: mutation });
    expect(result.errors).toBeUndefined();
    expect(result.data?.updateTodo).toMatchObject({
      id: "1",
      title: "Test todo",
      completed: true,
    });
  });

  it("should return null when updating non-existent todo", async () => {
    const mutation = `
      mutation {
        updateTodo(input: { id: "999", title: "Updated" }) {
          id
          title
        }
      }
    `;

    const result = await graphql({ schema, source: mutation });
    expect(result.errors).toBeUndefined();
    expect(result.data?.updateTodo).toBeNull();
  });

  it("should delete a todo", async () => {
    todoStore.create({ title: "To be deleted" });

    const mutation = `
      mutation {
        deleteTodo(id: "1")
      }
    `;

    const result = await graphql({ schema, source: mutation });
    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteTodo).toBe(true);

    const todo = todoStore.getById("1");
    expect(todo).toBeUndefined();
  });

  it("should return false when deleting non-existent todo", async () => {
    const mutation = `
      mutation {
        deleteTodo(id: "999")
      }
    `;

    const result = await graphql({ schema, source: mutation });
    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteTodo).toBe(false);
  });
});

describe("Integration Tests", () => {
  it("should handle complete CRUD workflow", async () => {
    const createMutation = `
      mutation {
        createTodo(input: { title: "Integration test todo" }) {
          id
          title
        }
      }
    `;

    const createResult = await graphql({ schema, source: createMutation });
    expect(createResult.data?.createTodo.id).toBe("1");

    const updateMutation = `
      mutation {
        updateTodo(input: { id: "1", completed: true }) {
          id
          completed
        }
      }
    `;

    const updateResult = await graphql({ schema, source: updateMutation });
    expect(updateResult.data?.updateTodo.completed).toBe(true);

    const queryAll = `
      query {
        todos {
          id
          title
          completed
        }
      }
    `;

    const queryResult = await graphql({ schema, source: queryAll });
    expect(queryResult.data?.todos).toHaveLength(1);

    const deleteMutation = `
      mutation {
        deleteTodo(id: "1")
      }
    `;

    const deleteResult = await graphql({ schema, source: deleteMutation });
    expect(deleteResult.data?.deleteTodo).toBe(true);

    const finalQueryResult = await graphql({ schema, source: queryAll });
    expect(finalQueryResult.data?.todos).toHaveLength(0);
  });
});
