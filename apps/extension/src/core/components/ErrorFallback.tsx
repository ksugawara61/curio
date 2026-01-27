import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";

export const ErrorFallback: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="alert alert-error">
      <div className="flex flex-col gap-2">
        <span>Error: {error.message}</span>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={resetErrorBoundary}
        >
          Retry
        </button>
      </div>
    </div>
  );
};
