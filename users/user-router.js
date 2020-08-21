const express = require("express");

const db = require("../data/db-config.js");
const users = require("./user-model.js");
const {
  findById,
  find,
  findPosts,
  add,
  update,
  remove,
} = require("./user-model.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const userData = await find();
  await res.status(200).json(userData);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const userData = await findById(id);
  if (userData) {
    await res.status(200).json(userData);
  } else {
    res.status(404).json({ message: "Could not find user with given id." });
  }
});

router.get("/:id/posts", async (req, res) => {
  const { id } = req.params;
  const postData = await findPosts(id);
  await res.status(200).json(postData);
});

router.post("/", (req, res) => {
  const userData = req.body;
  add(userData)
    .then((newUser) => {
      res.status(201).json({ created: newUser });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create new user" });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  update(changes, id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to update user" });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  remove(id)
    .then((count) => {
      if (count) {
        res.json({ removed: count });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to delete user" });
    });
});

module.exports = router;
