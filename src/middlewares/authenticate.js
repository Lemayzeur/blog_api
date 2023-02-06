import pg from "pg";
import { dbConfig } from "../db/client.js";
import { AUTHENTICATION_SCHEME } from "../constants.js";

export default async function authenticate(req, res, next) {
  const ftoken = req.headers.authorization;
  const [scheme, token] = ftoken.split(" ");

  // Check if scheme is ok and token is present
  if (scheme !== AUTHENTICATION_SCHEME || !token) {
    return res.status(401).json({ error: "Token header format invalid" });
  }

  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const result = await client.query(
      `SELECT user_id, expired_at FROM tokens WHERE raw = $1`,
      [token]
    );

    // If no token found
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Token invalid" });
    }

    const payload = result.rows[0];

    // Check token expiration
    const expiredAt = new Date(payload.expired_at).getTime();
    if (expiredAt <= new Date().getTime()) {
      return res.status(401).json({ error: "Token has expired" });
    }

    req.userId = payload.user_id;
    req.token = token;
    client.end();
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json(err);
  }
}
