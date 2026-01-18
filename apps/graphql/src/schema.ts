import { todoStore } from "./store.js";

export const typeDefs = `#graphql
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
  }

  input CreateTodoInput {
    title: String!
  }

  input UpdateTodoInput {
    id: ID!
    title: String
    completed: Boolean
  }

  type Query {
    todos: [Todo!]!
    todo(id: ID!): Todo
  }

  type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo
    deleteTodo(id: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    todos: () => todoStore.getAll(),
    todo: (_parent: unknown, args: { id: string }) =>
      todoStore.getById(args.id),
  },
  Mutation: {
    createTodo: (_parent: unknown, args: { input: { title: string } }) =>
      todoStore.create(args.input),
    updateTodo: (
      _parent: unknown,
      args: { input: { id: string; title?: string; completed?: boolean } }
    ) => todoStore.update(args.input),
    deleteTodo: (_parent: unknown, args: { id: string }) =>
      todoStore.delete(args.id),
  },
};
