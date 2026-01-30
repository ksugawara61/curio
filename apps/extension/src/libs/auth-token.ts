const AUTH_TOKEN_KEY = "curio_auth_token";

export const getAuthToken = async (): Promise<string | null> => {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    const result = await chrome.storage.local.get(AUTH_TOKEN_KEY);
    return (result[AUTH_TOKEN_KEY] as string) ?? null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = async (token: string): Promise<void> => {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    await chrome.storage.local.set({ [AUTH_TOKEN_KEY]: token });
    return;
  }
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = async (): Promise<void> => {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    await chrome.storage.local.remove(AUTH_TOKEN_KEY);
    return;
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
