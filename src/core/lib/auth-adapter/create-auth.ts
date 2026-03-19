import { watch, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTokenStore } from "./tokenStore";
import { useUserStore } from "./userStore";
import { DEFAULT_PUBLIC_ROUTES, getIsPublicRoute } from "./auth-guard";
import type {
  AuthAdapter,
  AuthMatrix,
  AuthUser,
  AuthCredential,
} from "./auth-adapter";

export interface AuthContextValue<
  TUser extends AuthUser = AuthUser,
  TMatrix extends AuthMatrix = AuthMatrix,
> {
  isLoggedIn: boolean;
  dataUser: TUser | null;
  dataMatrix?: TMatrix | null;
  logout: () => Promise<void>;
  login: (credential: AuthCredential) => Promise<any>;
}

/**
 * Creates a Vue-compatible authentication bridge using the provided adapter.
 */
export const createAuthAdapter = <
  TUser extends AuthUser = AuthUser,
  TMatrix extends AuthMatrix = AuthMatrix,
>(
  adapter: AuthAdapter<TUser, TMatrix>,
) => {
  // Shared state for the adapter
  const isInitializing = ref(false);
  const hasInitialized = ref(false);

  /**
   * Vue composable to consume Authentication state and actions.
   */
  const useAuth = (): AuthContextValue<TUser, TMatrix> => {
    const router = useRouter();
    const route = useRoute();
    const tokenStore = useTokenStore();
    const userStore = useUserStore();

    const guard = {
      publicRoutes: DEFAULT_PUBLIC_ROUTES,
      loggedOutRedirectTo: "/login",
      loggedInRedirectTo: "/",
      ...adapter.guard,
    };

    /**
     * One-time session initialization
     */
    const initAuth = async () => {
      if (isInitializing.value || hasInitialized.value) return;
      isInitializing.value = true;

      userStore.actions.setLoading(true);

      // Check URL for tokens (e.g., after social login redirect)
      const accessTokenParams = route.query.accessToken as string;
      const refreshTokenParams = route.query.refreshToken as string;

      let activeAccessToken = tokenStore.accessToken;
      let activeRefreshToken = tokenStore.refreshToken;

      if (accessTokenParams && refreshTokenParams) {
        activeAccessToken = accessTokenParams;
        activeRefreshToken = refreshTokenParams;
        tokenStore.actions.setToken({
          accessToken: accessTokenParams,
          refreshToken: refreshTokenParams,
        });

        // Clean URL params
        const newQuery = { ...route.query };
        delete newQuery.accessToken;
        delete newQuery.refreshToken;
        router.replace({ query: newQuery });
      }

      try {
        if (activeAccessToken) {
          const data = await adapter.getSession(
            activeAccessToken,
            activeRefreshToken,
          );
          userStore.actions.setUser({
            isLoggedIn: adapter.isLoggedIn(data.user, data.matrix || null),
            ...data.user,
          } as any);
          if (data?.matrix) userStore.actions.setDataMatrix(data.matrix);
        }
      } catch (error) {
        console.warn("[Auth] Error getting session:", error);
      } finally {
        userStore.actions.setLoading(false);
        isInitializing.value = false;
        hasInitialized.value = true;
      }
    };

    /**
     * Handle redirections based on auth status
     */
    const checkAccess = () => {
      if (userStore.isLoading) return;

      const isPublicRoute = getIsPublicRoute(guard.publicRoutes);
      const isLoggedIn = userStore.isLoggedIn;

      if (!isLoggedIn && !isPublicRoute && guard.loggedOutRedirectTo) {
        if (route.path !== guard.loggedOutRedirectTo) {
          router.replace(guard.loggedOutRedirectTo);
        }
      } else if (isLoggedIn && isPublicRoute && guard.loggedInRedirectTo) {
        if (route.path !== guard.loggedInRedirectTo) {
          router.replace(guard.loggedInRedirectTo);
        }
      }
    };

    // Initialize on mount
    onMounted(() => {
      initAuth();
    });

    // Watch for auth changes or route changes to enforce guards
    watch(
      [() => userStore.isLoggedIn, () => userStore.isLoading, () => route.path],
      () => {
        checkAccess();
      },
      { immediate: true },
    );

    const login = async (credential: AuthCredential) => {
      const response = await adapter.login(credential);
      tokenStore.actions.setToken({
        accessToken: response.accessToken || "",
        refreshToken: response.refreshToken || "",
      });

      const data = await adapter.getSession(
        response.accessToken || "",
        response.refreshToken || "",
      );
      userStore.actions.setUser({
        isLoggedIn: adapter.isLoggedIn(data.user, data.matrix || null),
        ...data.user,
      } as any);
      if (data?.matrix) userStore.actions.setDataMatrix(data.matrix);

      return response;
    };

    const logout = async () => {
      const at = tokenStore.accessToken;
      const rt = tokenStore.refreshToken;
      tokenStore.actions.clearToken();
      userStore.actions.clearUser();
      await adapter.logout((path) => router.push(path), at, rt);
    };

    return {
      isLoggedIn: userStore.isLoggedIn,
      dataUser: userStore.dataUser as TUser | null,
      dataMatrix: userStore.dataMatrix as TMatrix | null,
      logout,
      login,
    };
  };

  return { useAuth };
};
