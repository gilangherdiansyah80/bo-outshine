import type {
  DefaultAuthUserWithLoggedIn,
  AuthMatrix,
  AuthAdapter,
  AuthCredential,
} from "@/core/lib/auth-adapter/auth-adapter";
import { createAuthAdapter } from "@/core/lib/auth-adapter/create-auth";
import { DEFAULT_PUBLIC_ROUTES } from "@/core/lib/auth-adapter/auth-guard";
import { getUserStatusV3 } from "@/services/Shared/User";

const adapter: AuthAdapter<DefaultAuthUserWithLoggedIn, AuthMatrix> = {
  guard: {
    publicRoutes: DEFAULT_PUBLIC_ROUTES,
    loggedOutRedirectTo: `/${import.meta.env.VITE_ASSET_REVERSE || ""}/welcome`,
    loggedInRedirectTo: `/${import.meta.env.VITE_ASSET_REVERSE || ""}/home`,
  },
  getSession: async (accessToken: string, _refreshToken: string) => {
    try {
      const response = await getUserStatusV3(accessToken);
      return {
        user: {
          isLoggedIn: Boolean(response.data.Data.ID),
          name: response.data.Data.Name,
          email: response.data.Data.Email,
          ...response.data.Data,
        },
      };
    } catch (_err) {
      return {
        user: {
          isLoggedIn: false,
        } as DefaultAuthUserWithLoggedIn,
      };
    }
  },
  isLoggedIn: (
    user: DefaultAuthUserWithLoggedIn,
    _matrix: AuthMatrix | null,
  ) => {
    return Boolean(user.isLoggedIn);
  },
  login: async (credential: AuthCredential) => {
    const { email, password } = credential as unknown as Record<string, string>;

    // Mock successful login for now to match project flow
    if (email && password) {
      return {
        loggedIn: true,
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
      };
    }

    throw new Error("Invalid credentials");
  },
  logout: async (
    _navigate: (path: string) => void,
    _accessToken: string,
    _refreshToken: string,
  ) => {
    // Clear session and redirect to welcome
    if (typeof window !== "undefined") {
      window.location.href = `/${import.meta.env.VITE_ASSET_REVERSE || ""}/welcome`;
    }
  },
};

export const { useAuth } = createAuthAdapter(adapter);
