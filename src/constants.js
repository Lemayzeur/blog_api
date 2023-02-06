export const TOKEN_DURATION = 60 * 60; // 5 minutes

export const AUTHENTICATION_SCHEME = "Bearer"; // 5 minutes

export const ALLOWED_ORIGINS = [
  // Add allowed origins here
];
export const ALLOWED_METHODS = [
  "GET",
  "HEAD",
  "OPTIONS",
  "POST",
  "DELETE",
  "PATH",
  "PUT",
];
export const ALLOWED_HEADERS = [
  "Origin",
  "X-Requested-With",
  "Content-Type",
  "Accept",
  "Authorization",
];
export const HTTP_CREDENTIALS = true; // If True, cookies will be allowed to be included in cross-site HTTP requests
export const CACHE_MAX_AGE = 1 * 24 * 60 * 60; // The number of seconds the browser can cache the preflight response
