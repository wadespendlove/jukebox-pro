import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByUsername } from "#db/queries/users.js";
import { createToken } from "#utils/jwt.js";
import requireBody from "#middleware/requireBody.js";

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username already taken.");
      }

      const user = await createUser(username, password);
      const token = createToken({ id: user.id });

      res.status(201).send({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).send("Invalid username or password.");
      }

      const token = createToken({ id: user.id });

      res.send({ user, token });
    } catch (err) {
      next(err);
    }
  }
);
