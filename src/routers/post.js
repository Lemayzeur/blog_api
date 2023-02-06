import express from "express";
import {
  fetchPostsByUserId,
  createPost,
  updatePost,
  deletePost,
  getPostById,
  fetchPostTags,
  addPostTag,
  createPostTag,
  removePostTag,
  deleteTag,
} from "../queries/post.js";
import authenticate from "../middlewares/authenticate.js";
import cors from "../middlewares/cors.js";

const postRouter = express.Router();

// We use postRouter.all() instead of postRouter.get() because the
// cors middleware will only accept methods specfied in <allowedMethods>.
// We also do that, to be able to display a custom message for unallowed methods
// all() accepts all http methods
postRouter.all(
  "/",
  cors({ allowedMethods: ["GET", "POST"] }),
  authenticate,
  async (req, res) => {
    if (req.method == "GET") {
      // req.userId comes from middleware.js
      const posts = await fetchPostsByUserId(req.userId);
      return res.json(posts);
    } else if (req.method == "POST") {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .status(400)
          .json({ error: "Title and description are mandatory" });
      }
      const post = await createPost({ ...req.body, userId: req.userId });

      return res.status(201).json(post);
    }
    // no else{}, since the cors middleware will block it
  }
);

postRouter.post("/post-tags", async (req, res) => {
  const { tag_id, post_id } = req.body;

  if (!tag_id || !post_id) {
    return res.status(400).json({ error: "post_id and tag_id are mandatory" });
  }
  const tag = await addPostTag(tag_id, post_id);

  return res.status(201).json(tag);
});

postRouter.all(
  "/:id",
  authenticate,
  cors({ allowedMethods: ["PUT"] }),
  async (req, res) => {
    const { id } = req.params;

    // Get the potential post from database
    let post = await getPostById(id);

    // If no post found
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // If the post owner is different from the current user
    if (post.user_id !== req.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    post = await updatePost({ ...req.body, id });
    return res.status(200).json(post);
  }
);

postRouter.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  // Get the potential post from database
  let post = await getPostById(id);

  // If no post found
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // If the post owner is different from the current user
  if (post.user_id !== req.userId) {
    return res.status(403).json({ error: "Access denied" });
  }

  return res.status(200).json(post);
});

postRouter.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  // Get the potential post from database
  let post = await getPostById(id);

  // If no post found
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // If the post owner is different from the current user
  if (post.user_id !== req.userId) {
    return res.status(403).json({ error: "Access denied" });
  }

  // Delete the post from the database, with the id.
  await deletePost(id);

  return res.sendStatus(204);
});

postRouter.get("/:id/tags", async (req, res) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(400).json({ error: "postid is mandatory" });
  }

  const tags = await fetchPostTags(postId);
  console.log(tags);
  return res.status(200).json(tags);
});

postRouter.post("/:id/tags", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tag name is mandatory" });
  }
  const tag = await createPostTag(name, req.params.id);

  return res.status(201).json(tag);
});

postRouter.delete("/:id/tags/:tagId", async (req, res) => {
  const { id: postId, tagId } = req.params;

  if (!postId) {
    return res.status(400).json({ error: "Tag name is mandatory" });
  }
  await removePostTag(tagId, postId);

  return res.status(204);
});

postRouter.put("/:id/status", authenticate, async (req, res) => {
  const { id } = req.params;
  const { published } = req.body;

  if (typeof published !== "boolean") {
    return res
      .status(400)
      .json({ error: "<published> request body value is incorrect" });
  }

  // Get the potential post from database
  let post = await getPostById(id);

  // If no post found
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  // If the post owner is different from the current user
  if (post.user_id !== req.userId) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (published === true) {
    if (post.published !== true) {
      const now = new Date().getTime();
      post = await updatePost({ published, published_at: null, id });
    }
  } else {
    if (post.published === true) {
      post = await updatePost({ published, published_at: null, id });
    }
  }
  return res.status(200).json(post);
});

export default postRouter;
