import { createAxiosAdapter } from "@/core/lib/axios-adapter";
import { DEFAULT_PUBLIC_ROUTES } from "@/core/lib/auth-adapter/auth-guard";

const createAxios = (baseURL: string | undefined) => {
  return createAxiosAdapter({
    baseURL,
    guard: {
      publicRoutes: DEFAULT_PUBLIC_ROUTES,
      loggedOutRedirectTo: `/${import.meta.env.VITE_ASSET_REVERSE || ""}/`,
      statusCode: [401, 403],
    },
  });
};

// API's with Vercel API domain
export const fetcher = createAxios(import.meta.env.VITE_API_URL);

// Keeping some generic names for compatibility if they were used elsewhere
export const fetcherOSStore = fetcher;

export const fetcherMock = createAxios("/");
