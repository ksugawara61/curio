import { useCallback, useEffect, useState } from "react";
import { authClient } from "../../../libs/auth-client";
import {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "../../../libs/auth-token";

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuth = (): AuthState => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthState["user"]>(null);

  const checkSession = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data: session } = await authClient.getSession({
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? null,
        });
      } else {
        await removeAuthToken();
        setUser(null);
      }
    } catch {
      await removeAuthToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signIn = useCallback(async () => {
    const { data } = await authClient.signIn.social({
      provider: "github",
      fetchOptions: {
        onSuccess: async (ctx) => {
          const token = ctx.response.headers.get("set-auth-token");
          if (token) {
            await setAuthToken(token);
            await checkSession();
          }
        },
      },
    });

    if (data?.url) {
      // Open the OAuth URL in a new tab (Chrome extension context)
      if (typeof chrome !== "undefined" && chrome.tabs?.create) {
        chrome.tabs.create({ url: data.url });
      } else {
        window.open(data.url, "_blank");
      }
    }
  }, [checkSession]);

  const signOut = useCallback(async () => {
    const token = await getAuthToken();
    if (token) {
      try {
        await authClient.signOut({
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
      } catch {
        // Ignore sign-out errors
      }
    }
    await removeAuthToken();
    setUser(null);
  }, []);

  return {
    isAuthenticated: user !== null,
    isLoading,
    user,
    signIn,
    signOut,
  };
};
