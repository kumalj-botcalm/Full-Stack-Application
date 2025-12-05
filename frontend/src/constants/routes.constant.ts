export const ROUTES = {
  HOME: '/dashboard',
  PRODUCTS: '/products',
  USERS: '/users',
  PROFILE: '/profile',
  INQUIRY: '/inquiry',
  LOGIN: '/',
  REGISTER: '/register',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = (typeof ROUTES)[RouteKey];
