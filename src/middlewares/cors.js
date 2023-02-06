import {
  ALLOWED_ORIGINS,
  ALLOWED_METHODS,
  ALLOWED_HEADERS,
  HTTP_CREDENTIALS,
  CACHE_MAX_AGE,
} from "../constants.js";

export default function cors({
  allowedMethods = ALLOWED_METHODS,
  allowedOrigins = ALLOWED_ORIGINS,
  allowedHeaders = ALLOWED_HEADERS,
  allowCredentials = HTTP_CREDENTIALS,
  maxAge = CACHE_MAX_AGE,
} = {}) {
  return (req, res, next) => {
    // Check the origin to allow
    let origin = "*";
    if (allowedOrigins.includes("*") === false) {
      // If the * doesn't appear in the list, check the authorized origins.
      origin = allowedOrigins.includes(req.header("origin")?.toLowerCase())
        ? req.headers.origin
        : allowedOrigins[0];
    }

    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    res.header("Access-Control-Allow-Credentials", allowCredentials.toString());
    res.header("Access-Control-Max-Age", maxAge.toString());
    res.header("Access-Control-Allow-Methods", allowedMethods.join(", "));

    // CORS preflight requests
    if (req.method === "OPTIONS") return res.status(204).send();

    // If the method doesn't appear in the list, block the request
    if (!allowedMethods.includes(req.method)) return res.sendStatus(405);

    // Everything is OK. Continue!!!
    next();
  };
}
