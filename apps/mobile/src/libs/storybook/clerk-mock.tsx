// @clerk/clerk-expo のモック（Storybook 用）
// ネイティブモジュールへの依存を回避するためブラウザ環境向けに差し替える

export const useUser = () => ({
  user: {
    id: "test-user",
    emailAddresses: [{ emailAddress: "test@example.com" }],
  },
  isSignedIn: true,
  isLoaded: true,
});

export const useClerk = () => ({
  signOut: () => Promise.resolve(),
});

export const useAuth = () => ({
  getToken: () => Promise.resolve("test-token"),
  isSignedIn: true,
  isLoaded: true,
});
