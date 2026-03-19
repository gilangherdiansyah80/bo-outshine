export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
