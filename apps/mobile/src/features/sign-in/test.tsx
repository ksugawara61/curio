import { render, screen } from "@curio/testing-library";
import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignIn } from ".";

const mocks = vi.hoisted(() => ({
  signInCreate: vi.fn(),
  setActive: vi.fn(),
  routerReplace: vi.fn(),
  isLoadedRef: { value: true },
}));

vi.mock("@clerk/clerk-expo", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  useSignIn: () => ({
    signIn: { create: mocks.signInCreate },
    setActive: mocks.setActive,
    isLoaded: mocks.isLoadedRef.value,
  }),
  useClerk: () => ({ signOut: vi.fn().mockResolvedValue(undefined) }),
  useUser: () => ({
    user: {
      id: "test-user",
      emailAddresses: [{ emailAddress: "test@example.com" }],
    },
    isSignedIn: true,
    isLoaded: true,
  }),
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue("test-token"),
    isSignedIn: true,
    isLoaded: true,
  }),
}));

vi.mock("expo-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mocks.routerReplace,
    back: vi.fn(),
  }),
  Link: ({ children }: { children: React.ReactNode }) => children,
  useLocalSearchParams: () => ({}),
}));

describe("SignIn", () => {
  it("サインインフォームをレンダリングする", () => {
    render(<SignIn />);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("メールアドレスとパスワードを入力できる", () => {
    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });

    expect(screen.getByPlaceholderText("Enter email")).toHaveValue(
      "user@example.com",
    );
    expect(screen.getByPlaceholderText("Enter password")).toHaveValue(
      "password123",
    );
  });

  it("サインイン成功時にホームにリダイレクトする", async () => {
    mocks.signInCreate.mockResolvedValue({
      status: "complete",
      createdSessionId: "session-123",
    });
    mocks.setActive.mockResolvedValue(undefined);
    mocks.routerReplace.mockClear();

    render(<SignIn />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(mocks.routerReplace).toHaveBeenCalledWith("/");
    });
  });

  it("サインインが完了でない場合はリダイレクトしない", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.signInCreate.mockResolvedValue({ status: "needs_first_factor" });
    mocks.routerReplace.mockClear();

    render(<SignIn />);

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(mocks.signInCreate).toHaveBeenCalled();
    });
    expect(mocks.routerReplace).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("エラー発生時はコンソールにエラーを出力する", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.signInCreate.mockRejectedValue(new Error("Network error"));

    render(<SignIn />);

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("isLoaded が false の場合は何もしない", async () => {
    mocks.isLoadedRef.value = false;
    mocks.signInCreate.mockClear();

    render(<SignIn />);

    fireEvent.click(screen.getByText("Continue"));

    await Promise.resolve();
    expect(mocks.signInCreate).not.toHaveBeenCalled();

    mocks.isLoadedRef.value = true;
  });
});
