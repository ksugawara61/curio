import { render, screen } from "@curio/testing-library";
import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SignUp } from ".";

const mocks = vi.hoisted(() => ({
  signUpCreate: vi.fn(),
  prepareEmailAddressVerification: vi.fn(),
  attemptEmailAddressVerification: vi.fn(),
  setActive: vi.fn(),
  routerReplace: vi.fn(),
  isLoadedRef: { value: true },
}));

vi.mock("@clerk/clerk-expo", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  useSignUp: () => ({
    signUp: {
      create: mocks.signUpCreate,
      prepareEmailAddressVerification: mocks.prepareEmailAddressVerification,
      attemptEmailAddressVerification: mocks.attemptEmailAddressVerification,
    },
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

describe("SignUp", () => {
  it("サインアップフォームをレンダリングする", () => {
    render(<SignUp />);

    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("メールアドレスとパスワードを入力できる", () => {
    render(<SignUp />);

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

  it("サインアップ送信後にメール確認フォームに遷移する", async () => {
    mocks.signUpCreate.mockResolvedValue(undefined);
    mocks.prepareEmailAddressVerification.mockResolvedValue(undefined);

    render(<SignUp />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Verify your email")).toBeInTheDocument();
    });

    expect(mocks.signUpCreate).toHaveBeenCalledWith({
      emailAddress: "user@example.com",
      password: "password123",
    });
    expect(mocks.prepareEmailAddressVerification).toHaveBeenCalledWith({
      strategy: "email_code",
    });
  });

  it("サインアップ時のエラーをコンソールに出力する", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.signUpCreate.mockRejectedValue(new Error("Sign up failed"));

    render(<SignUp />);

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it("isLoaded が false の場合は何もしない（サインアップ）", async () => {
    mocks.isLoadedRef.value = false;
    mocks.signUpCreate.mockClear();

    render(<SignUp />);

    fireEvent.click(screen.getByText("Continue"));

    await Promise.resolve();
    expect(mocks.signUpCreate).not.toHaveBeenCalled();

    mocks.isLoadedRef.value = true;
  });

  it("確認コードを入力して認証に成功するとホームにリダイレクトする", async () => {
    mocks.signUpCreate.mockResolvedValue(undefined);
    mocks.prepareEmailAddressVerification.mockResolvedValue(undefined);
    mocks.attemptEmailAddressVerification.mockResolvedValue({
      status: "complete",
      createdSessionId: "session-123",
    });
    mocks.setActive.mockResolvedValue(undefined);
    mocks.routerReplace.mockClear();

    render(<SignUp />);

    // Submit sign-up form first
    fireEvent.click(screen.getByText("Continue"));

    // Wait for verification form
    await waitFor(() => {
      expect(screen.getByText("Verify your email")).toBeInTheDocument();
    });

    // Enter verification code
    fireEvent.change(
      screen.getByPlaceholderText("Enter your verification code"),
      {
        target: { value: "123456" },
      },
    );
    fireEvent.click(screen.getByText("Verify"));

    await waitFor(() => {
      expect(mocks.routerReplace).toHaveBeenCalledWith("/");
    });
  });

  it("確認コードの認証が完了でない場合はリダイレクトしない", async () => {
    mocks.signUpCreate.mockResolvedValue(undefined);
    mocks.prepareEmailAddressVerification.mockResolvedValue(undefined);
    mocks.attemptEmailAddressVerification.mockResolvedValue({
      status: "missing_requirements",
    });
    mocks.routerReplace.mockClear();

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<SignUp />);

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Verify your email")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Verify"));

    await waitFor(() => {
      expect(mocks.attemptEmailAddressVerification).toHaveBeenCalled();
    });
    expect(mocks.routerReplace).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("確認コード認証時のエラーをコンソールに出力する", async () => {
    mocks.signUpCreate.mockResolvedValue(undefined);
    mocks.prepareEmailAddressVerification.mockResolvedValue(undefined);
    mocks.attemptEmailAddressVerification.mockRejectedValue(
      new Error("Verification failed"),
    );

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<SignUp />);

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Verify your email")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Verify"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
