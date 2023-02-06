import { dbConfig } from "../db/client.js";
import pg from "pg";

export const fetchPosts = async () => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(`SELECT * FROM posts`);
    const payload = res.rows;
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const fetchPostsByUserId = async (userId) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(`SELECT * FROM posts WHERE user_id=$1`, [
      userId,
    ]);
    const payload = res.rows;
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const getPostById = async (id) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(`SELECT * FROM posts WHERE id=$1`, [id]);
    const payload = res.rows[0];
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const createPost = async (data) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(
      `INSERT INTO posts(title, description, photo, user_id) VALUES (
		$1, $2, $3, $4) RETURNING id, title, description, photo`,
      [data.title, data.description, data.photo, data.userId]
    );
    const payload = res.rows[0];
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = async (data) => {
  // retire id, nan chan ki pral update yo
  const { id } = data;
  delete data.id;

  const validFields = [
    "title",
    "description",
    "photo",
    "published",
    "published_at",
  ];

  // Teknik pou jenere chan ki pral update yo: key=$index
  let positions = "";
  let fields = [];
  let values = [];
  Object.entries(data).forEach(([key], index) => {
    if (validFields.includes(key)) {
      positions += `${key}=\$${index + 1}`;
      fields.push(key);
      values.push(data[key]);
      if (index + 1 < Object.keys(data).length) {
        positions += ", ";
      }
    }
  });

  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(
      `UPDATE posts SET ${positions} WHERE id=$${
        Object.keys(fields).length + 1
      } RETURNING *`,
      values.concat(id)
    );
    const payload = res.rows[0];
    client.end();
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = async (id) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    await client.query(`DELETE FROM posts WHERE id=$1`, [id]);
    client.end();
  } catch (err) {
    console.log(err);
  }
};

export const addPostTag = async (tagId, postId) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    await client.query(
      `INSERT INTO post_tags(tag_id, post_id) VALUES ($1, $2) 
      ON CONFLICT DO NOTHING`,
      [tagId, postId]
    );
    client.end();
  } catch (err) {
    console.log(err);
  }
};

export const createPostTag = async (data, postId) => {
  const client = new pg.Pool(dbConfig);
  await client.connect();
  try {
    await client.query("BEGIN"); // db transaction begins

    // Create the tag first
    const res = await client.query(
      `INSERT INTO tags(name) VALUES ($1) RETURNING id`,
      [data.name]
    );
    const tagId = res.rows[0].id;

    // Create the posttag instance
    const res2 = await client.query(
      `INSERT INTO post_tags(tag_id, post_id) VALUES ($1, $2)`,
      [tagId, postId]
    );
    await client.query("COMMIT");
    return res2.rows;
  } catch (err) {
    // Roll back in case of errors
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const removePostTag = async (tagId, postId) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    await client.query(`DELETE FROM post_tags WHERE tag_id=$1 AND post_id=$2`, [
      tagId,
      postId,
    ]);
    client.end();
  } catch (err) {
    throw err;
    console.log(err);
  }
};

export const deleteTag = async (tagId) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    await client.query(`DELETE FROM tags WHERE tag_id=$1 2`, [tagId]);
    client.end();
  } catch (err) {
    console.log(err);
  }
};

export const fetchPostTags = async (postId) => {
  try {
    const client = new pg.Client(dbConfig);
    await client.connect();
    const res = await client.query(
      `SELECT * FROM tags t JOIN post_tags pt 
        ON pt.tag_id = t.id WHERE post_id=$1`,
      [postId]
    );
    client.end();
    return res.rows;
  } catch (err) {
    console.log(err);
  }
};
