import { createFileRoute } from "@tanstack/react-router";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Hello World</h1>
        <p className="mt-4 text-lg text-base-content/70">
          Welcome to Curio Web
        </p>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: Index,
});
