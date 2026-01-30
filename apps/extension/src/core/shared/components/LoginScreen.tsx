import type { FC } from "react";

type Props = {
  onSignIn: () => Promise<void>;
};

export const LoginScreen: FC<Props> = ({ onSignIn }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h1 className="card-title text-2xl">Curio</h1>
          <p className="text-base-content/70">
            Sign in to start managing your bookmarks
          </p>
          <div className="card-actions mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSignIn}
            >
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
