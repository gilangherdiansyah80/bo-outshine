import xior from "xior";
import type { XiorInstance as BaseXiorInstance } from "xior";

import { useTokenStore } from "@/core/lib/auth-adapter/tokenStore";
import { useUserStore } from "@/core/lib/auth-adapter/userStore";
import {
  DEFAULT_PUBLIC_ROUTES,
  getIsPublicRoute,
  type PublicRoute,
  type RouteMethod,
} from "@/core/lib/auth-adapter/auth-guard";

// Token interface
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Axios configuration options
export interface CreateAxiosOptions {
  baseURL?: string;
  getToken?: () => AuthTokens;
  getLanguageId?: () => string;
  clearSession?: () => void;
  languageId?: string;

  maintenance?: {
    redirectTo?: string;
    statusCode?: number;
  };

  guard?: {
    publicRoutes?: PublicRoute[];
    statusCode?: number[];
    loggedOutRedirectTo?: string;
  };
}

// Xior instance type (from xior package)
export type XiorInstance = BaseXiorInstance;

/**
 * Creates a configured Xior (axios-like) instance with authentication and error handling.
 */
export const createAxiosAdapter = ({
  baseURL = "/",
  getToken = () => {
    const tokenStore = useTokenStore();
    return {
      accessToken: tokenStore.accessToken || "",
      refreshToken: tokenStore.refreshToken || "",
    };
  },
  clearSession = () => {
    const tokenStore = useTokenStore();
    const userStore = useUserStore();
    tokenStore.actions.clearToken();
    userStore.actions.clearUser();
    // Wishlist store removed as it doesn't exist in the current project structure
  },

  getLanguageId = () => "",
  maintenance: maintenanceProps,
  guard: guardProps,
}: CreateAxiosOptions): XiorInstance => {
  const maintenance = {
    redirectTo: `${import.meta.env.VITE_INTERNAL_WEB || "/"}sistem`,
    statusCode: 503,
    ...maintenanceProps,
  };

  const guard: CreateAxiosOptions["guard"] = {
    publicRoutes: DEFAULT_PUBLIC_ROUTES,
    statusCode: [401],
    loggedOutRedirectTo: "/login",
    ...guardProps,
  };

  const fetcher = xior.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
  });

  // Request interceptor - Add authentication tokens to all requests if they exist
  fetcher.interceptors.request.use(
    (config) => {
      const token = getToken();

      const isPublicEndpoint =
        config.url?.includes("/auth/") ||
        (config.method?.toLowerCase() === "get" &&
          config.url?.includes("/products"));

      const isRefreshEndpoint = config.url?.includes("/auth/refresh");

      if (token?.accessToken && !isPublicEndpoint && !isRefreshEndpoint) {
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      }

      // Only send refresh token on refresh endpoint
      if (token?.refreshToken && isRefreshEndpoint) {
        config.headers["refresh-token"] = token.refreshToken;
      }

      const languageid = getLanguageId();
      if (languageid) config.headers["languageid"] = languageid;

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor - Handle global error responses
  fetcher.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if (error.response.status === maintenance.statusCode) {
          console.warn(
            "Service Unavailable (503). Redirecting to maintenance page.",
          );
          if (typeof window !== "undefined") {
            window.location.replace(maintenance.redirectTo);
          }
        }
        if (guard.statusCode?.includes(error.response.status)) {
          clearSession();
          const isPublicRoute = getIsPublicRoute(guard.publicRoutes || []);
          if (typeof window !== "undefined" && !isPublicRoute) {
            window.location.replace(guard.loggedOutRedirectTo!);
          }
        }
      } else if (error instanceof Error) {
        console.error("Request setup error:", error.message);
      }

      return Promise.reject(error);
    },
  );

  return fetcher;
};

export type { PublicRoute, RouteMethod };
