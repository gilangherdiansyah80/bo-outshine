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
export const createAxiosAdapter = (options: CreateAxiosOptions): XiorInstance => {
  const {
    baseURL = "/",
    getToken,
    clearSession,
    getLanguageId = () => "",
    maintenance: maintenanceProps,
    guard: guardProps,
  } = options;

  const maintenance = {
    redirectTo: `${import.meta.env.VITE_INTERNAL_WEB || "/"}sistem`,
    statusCode: 503,
    ...maintenanceProps,
  };

  const guard = {
    publicRoutes: DEFAULT_PUBLIC_ROUTES,
    statusCode: [401],
    loggedOutRedirectTo: "/login",
    ...guardProps,
  };

  // Internal helper to get tokens lazily
  const internalGetToken = (): AuthTokens => {
    if (getToken) return getToken();
    try {
      const tokenStore = useTokenStore();
      return {
        accessToken: tokenStore.accessToken || "",
        refreshToken: tokenStore.refreshToken || "",
      };
    } catch (e) {
      return { accessToken: "", refreshToken: "" };
    }
  };

  // Internal helper to clear session lazily
  const internalClearSession = () => {
    if (clearSession) {
      clearSession();
      return;
    }
    try {
      const tokenStore = useTokenStore();
      const userStore = useUserStore();
      tokenStore.actions.clearToken();
      userStore.actions.clearUser();
    } catch (e) {
      console.warn("Could not clear session: Pinia not ready");
    }
  };

  const fetcher = xior.create({
    baseURL,
    timeout: 30000,
  });

  // Request interceptor
  fetcher.interceptors.request.use(
    (config: any) => {
      const token = internalGetToken();

      const isPublicEndpoint =
        config.url?.includes("/auth/") ||
        (config.method?.toLowerCase() === "get" &&
          config.url?.includes("/products"));

      const isRefreshEndpoint = config.url?.includes("/auth/refresh");

      if (token?.accessToken && !isPublicEndpoint && !isRefreshEndpoint) {
        config.headers.Authorization = `Bearer ${token.accessToken}`;
      }

      if (token?.refreshToken && isRefreshEndpoint) {
        config.headers["refresh-token"] = token.refreshToken;
      }

      const languageid = getLanguageId();
      if (languageid) config.headers["languageid"] = languageid;

      return config;
    },
    (error: any) => Promise.reject(error),
  );

  // Response interceptor
  fetcher.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response) {
        if (error.response.status === maintenance.statusCode) {
          if (typeof window !== "undefined") {
            window.location.replace(maintenance.redirectTo);
          }
        }
        if (guard.statusCode?.includes(error.response.status)) {
          internalClearSession();
          const isPublicRoute = getIsPublicRoute(guard.publicRoutes || []);
          if (typeof window !== "undefined" && !isPublicRoute) {
            window.location.replace(guard.loggedOutRedirectTo || "/login");
          }
        }
      }
      return Promise.reject(error);
    },
  );

  return fetcher;
};

export type { PublicRoute, RouteMethod };
