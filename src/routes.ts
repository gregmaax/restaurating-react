/**
 * Routes publiques
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * Routes protégées par l'auth
 * Redirection vers /settings si loggedIn
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Route de redirection après connexion
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
