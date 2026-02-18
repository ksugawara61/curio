import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type TokenCache = {
  getToken: (key: string) => Promise<string | undefined | null>;
  saveToken: (key: string, value: string) => Promise<void>;
  clearToken?: (key: string) => void;
};

const createTokenCache = (): TokenCache => {
  return {
    getToken: async (key: string) => {
      try {
        const item = await SecureStore.getItemAsync(key);
        return item;
      } catch {
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    saveToken: async (key: string, value: string) => {
      await SecureStore.setItemAsync(key, value);
    },
    clearToken: (key: string) => {
      SecureStore.deleteItemAsync(key);
    },
  };
};

export const tokenCache =
  Platform.OS !== "web" ? createTokenCache() : undefined;
