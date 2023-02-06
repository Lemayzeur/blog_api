import crypto from "crypto";
import { dbConfig } from "../db/client.js";
import pg from "pg";

import { TOKEN_DURATION } from "../constants.js";

export const createToken = async (userId) => {
  // Evaluate future date
  const now = new Date();
  var expiredAt = new Date(now.getTime() + TOKEN_DURATION * 1000).getTime();

  // Generate random token
  const token = crypto.randomBytes(64).toString("hex");
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(
      `INSERT INTO tokens(raw, user_id, expired_at) VALUES ($1, $2, to_timestamp($3 / 1000.0)) RETURNING raw, expired_at`,
      [token, userId, expiredAt]
    );
    const payload = res.rows[0];
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const deleteTokensByUserId = async (userId) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(`DELETE FROM tokens WHERE user_id = $1`, [
      userId,
    ]);
    const payload = res.rows.length > 0;
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const deleteToken = async (raw) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(`DELETE FROM tokens WHERE raw = $1`, [raw]);
    const payload = res.rows.length > 0;
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};
