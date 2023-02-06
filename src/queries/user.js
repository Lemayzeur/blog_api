import { dbConfig } from "../db/client.js";
import bcrypt from "bcrypt";
import pg from "pg";

export const fetchUsers = async () => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(`SELECT * FROM users`);
    const payload = res.rows;
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const getUserById = async (id) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(
      `SELECT id, email, first_name, last_name, last_login, date_joined FROM users WHERE id = $1`,
      [id]
    );
    const payload = res.rows[0];
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const deleteUser = async (id) => {};

export const checkUserExists = async (rows) => {
  // Teknik pou jenere: field1,field2=$1,$2
  let positions = "",
    fields = "";
  Object.entries(rows).forEach(([key], index) => {
    positions += `\$${index + 1}`;
    fields += key;
    if (index + 1 < Object.keys(rows).length) {
      positions += ", ";
      fields += ", ";
    }
  });

  const queryString = `SELECT EXISTS(SELECT 1 FROM users WHERE ${fields}=${positions})`;
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(queryString, Object.values(rows));
    const payload = res.rows[0].exists;
    client.end();
    return payload;
  } catch (error) {
    console.log(error);
  }
};
export const createUser = async (data) => {
  // Hashing the password
  const hashPswd = await bcrypt.hash(data.password, 10);

  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(
      `INSERT INTO users(email, password, first_name, last_name) VALUES (
		$1, $2, $3, $4) RETURNING id`,
      [data.email, hashPswd, data.first_name, data.last_name]
    );
    const payload = res.rows[0];
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const verifyUser = async (email, password) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user = res.rows[0];
    client.end();
    if (!user) return null;
    const OK = await bcrypt.compare(password, user.password);
    if (OK) {
      return user;
    }
  } catch (err) {
    console.log(err);
  }
};
