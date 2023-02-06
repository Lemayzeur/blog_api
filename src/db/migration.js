import { pool } from "./client.js";

const cmd1 = `CREATE TABLE IF NOT EXISTS "users" (
	    "id" SERIAL,
	    "first_name" VARCHAR(255),
		 "last_name" VARCHAR(255),
	    "email" VARCHAR(120) NOT NULL UNIQUE,
		 "password" VARCHAR(120) NOT NULL,
		 "date_joined" TIMESTAMP DEFAULT NOW(),
		 "last_login" TIMESTAMP,
	    PRIMARY KEY ("id")
    );`;

const cmd2 = `CREATE TABLE IF NOT EXISTS "posts" (
	    "id" SERIAL,
	    "title" VARCHAR(255) NOT NULL,
		 "description" TEXT NOT NULL,
	    "photo" VARCHAR(255),
		 "user_id" INT NOT NULL,
		 "created_at" TIMESTAMP DEFAULT NOW(),
		 "updated_at" TIMESTAMP,
		 "published" BOOLEAN DEFAULT FALSE,
		 "published_at" TIMESTAMP,
	    PRIMARY KEY ("id"),
		 CONSTRAINT fk_post_user
   	FOREIGN KEY(user_id) 
   REFERENCES users(id)
   ON DELETE cascade
   ON UPDATE cascade
    );`;

const cmd3 = `CREATE TABLE IF NOT EXISTS "tokens" (
	    "id" SERIAL,
	    "raw" VARCHAR(255) NOT NULL,
		 "user_id" INT NOT NULL,
		 "expired" BOOLEAN default False,
		 "expired_at" TIMESTAMP,
	    PRIMARY KEY ("id"),
		 CONSTRAINT fk_token_user
   	FOREIGN KEY(user_id) 
   REFERENCES users(id)
   ON DELETE cascade
   ON UPDATE cascade
    );`;

const cmd4 = `CREATE TABLE IF NOT EXISTS "tags" (
	    "id" SERIAL,
	    "name" VARCHAR(100) NOT NULL,
		 "created_at" TIMESTAMP DEFAULT NOW(),
	    PRIMARY KEY ("id")
    );CREATE TABLE IF NOT EXISTS "post_tags" (
	    "id" SERIAL,
	    "post_id" INT NOT NULL,
		 "tag_id" INT NOT NULL,
		 UNIQUE (post_id, tag_id),
	    PRIMARY KEY ("id"),
		FOREIGN KEY(post_id) 
		REFERENCES posts(id)
		ON DELETE cascade
		ON UPDATE cascade,
		FOREIGN KEY(tag_id) 
		REFERENCES tags(id)
		ON DELETE cascade
		ON UPDATE cascade
    );`;

export default async function () {
  try {
    await pool.connect();
    await pool.query(cmd1);
    await pool.query(cmd2);
    await pool.query(cmd3);
    await pool.query(cmd4);
    await pool.end();
    console.log("Table created");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
