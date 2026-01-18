import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { todoStore } from "./store.js";

const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    completed: { type: new GraphQLNonNull(GraphQLBoolean) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const CreateTodoInputType = new GraphQLInputObjectType({
  name: "CreateTodoInput",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const UpdateTodoInputType = new GraphQLInputObjectType({
  name: "UpdateTodoInput",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    todos: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TodoType))),
      resolve: () => todoStore.getAll(),
    },
    todo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_parent, args: { id: string }) => todoStore.getById(args.id),
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createTodo: {
      type: new GraphQLNonNull(TodoType),
      args: {
        input: { type: new GraphQLNonNull(CreateTodoInputType) },
      },
      resolve: (_parent, args: { input: { title: string } }) =>
        todoStore.create(args.input),
    },
    updateTodo: {
      type: TodoType,
      args: {
        input: { type: new GraphQLNonNull(UpdateTodoInputType) },
      },
      resolve: (
        _parent,
        args: { input: { id: string; title?: string; completed?: boolean } }
      ) => todoStore.update(args.input),
    },
    deleteTodo: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_parent, args: { id: string }) => todoStore.delete(args.id),
    },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
