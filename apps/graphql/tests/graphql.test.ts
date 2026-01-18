import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { apolloServer, server } from "../src/index.js";
import { todoStore } from "../src/store.js";

beforeEach(() => {
  todoStore.clear();
});

afterAll(async () => {
  await apolloServer.stop();
  server.close();
});

describe("GraphQL Queries", () => {
  it("should return empty array when no todos exist", async () => {
    const result = await apolloServer.executeOperation({
      query: `
        query {
          todos {
            id
            title
            completed
          }
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.todos).toEqual([]);
    }
  });

  it("should return all todos", async () => {
    todoStore.create({ title: "First todo" });
    todoStore.create({ title: "Second todo" });

    const result = await apolloServer.executeOperation({
      query: `
        query {
          todos {
            id
            title
            completed
          }
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.todos).toHaveLength(2);
      expect(result.body.singleResult.data?.todos[0]).toMatchObject({
        id: "1",
        title: "First todo",
        completed: false,
      });
    }
  });

  it("should return a specific todo by id", async () => {
    todoStore.create({ title: "Test todo" });

    const result = await apolloServer.executeOperation({
      query: `
        query {
          todo(id: "1") {
            id
            title
            completed
            createdAt
          }
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.todo).toMatchObject({
        id: "1",
        title: "Test todo",
        completed: false,
      });
      expect(result.body.singleResult.data?.todo.createdAt).toBeDefined();
    }
  });

  it("should return null for non-existent todo", async () => {
    const result = await apolloServer.executeOperation({
      query: `
        query {
          todo(id: "999") {
            id
            title
          }
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.todo).toBeNull();
    }
  });
});

describe("GraphQL Mutations", () => {
  it("should create a new todo", async () => {
    const result = await apolloServer.executeOperation({
      query: `
        mutation {
          createTodo(input: { title: "New todo" }) {
            id
            title
            completed
            createdAt
          }
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.createTodo).toMatchObject({
        id: "1",
        title: "New todo",
        completed: false,
      });
      expect(result.body.singleResult.data?.createTodo.createdAt).toBeDefined();
    }
  });

  it("should update todo title", async () => {
    todoStore.create({ title: "Original title" });

    const result = await apolloServer.executeOperation({
      query: `
        mutation {
          updateTodo(input: { id: "1", title: "Updated title" }) {
            id
            title
            completed
          }
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.updateTodo).toMatchObject({
        id: "1",
        title: "Updated title",
        completed: false,
      });
    }
  });

  it("should update todo completion status", async () => {
    todoStore.create({ title: "Test todo" });

    const result = await apolloServer.executeOperation({
      query: `
        mutation {
          updateTodo(input: { id: "1", completed: true }) {
            id
            title
            completed
          }
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.updateTodo).toMatchObject({
        id: "1",
        title: "Test todo",
        completed: true,
      });
    }
  });

  it("should return null when updating non-existent todo", async () => {
    const result = await apolloServer.executeOperation({
      query: `
        mutation {
          updateTodo(input: { id: "999", title: "Updated" }) {
            id
            title
          }
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.updateTodo).toBeNull();
    }
  });

  it("should delete a todo", async () => {
    todoStore.create({ title: "To be deleted" });

    const result = await apolloServer.executeOperation({
      query: `
        mutation {
          deleteTodo(id: "1")
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.deleteTodo).toBe(true);
    }

    const todo = todoStore.getById("1");
    expect(todo).toBeUndefined();
  });

  it("should return false when deleting non-existent todo", async () => {
    const result = await apolloServer.executeOperation({
      query: `
        mutation {
          deleteTodo(id: "999")
        }
      `,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data?.deleteTodo).toBe(false);
    }
  });
});

describe("Integration Tests", () => {
  it("should handle complete CRUD workflow", async () => {
    const createResult = await apolloServer.executeOperation({
      query: `
        mutation {
          createTodo(input: { title: "Integration test todo" }) {
            id
            title
          }
        }
      `,
    });

    expect(createResult.body.kind).toBe("single");
    if (createResult.body.kind === "single") {
      expect(createResult.body.singleResult.data?.createTodo.id).toBe("1");
    }

    const updateResult = await apolloServer.executeOperation({
      query: `
        mutation {
          updateTodo(input: { id: "1", completed: true }) {
            id
            completed
          }
        }
      `,
    });

    expect(updateResult.body.kind).toBe("single");
    if (updateResult.body.kind === "single") {
      expect(updateResult.body.singleResult.data?.updateTodo.completed).toBe(
        true
      );
    }

    const queryResult = await apolloServer.executeOperation({
      query: `
        query {
          todos {
            id
            title
            completed
          }
        }
      `,
    });

    expect(queryResult.body.kind).toBe("single");
    if (queryResult.body.kind === "single") {
      expect(queryResult.body.singleResult.data?.todos).toHaveLength(1);
    }

    const deleteResult = await apolloServer.executeOperation({
      query: `
        mutation {
          deleteTodo(id: "1")
        }
      `,
    });

    expect(deleteResult.body.kind).toBe("single");
    if (deleteResult.body.kind === "single") {
      expect(deleteResult.body.singleResult.data?.deleteTodo).toBe(true);
    }

    const finalQueryResult = await apolloServer.executeOperation({
      query: `
        query {
          todos {
            id
            title
            completed
          }
        }
      `,
    });

    expect(finalQueryResult.body.kind).toBe("single");
    if (finalQueryResult.body.kind === "single") {
      expect(finalQueryResult.body.singleResult.data?.todos).toHaveLength(0);
    }
  });
});
