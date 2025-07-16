import express from "express";
const app = express();
export default app;

import morgan from "morgan";
import getUserFromToken from "#middleware/getUserFromToken.js";

import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";
import usersRouter from "#api/users.js";

app.use(express.json());
app.use(getUserFromToken());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  // A switch statement can be used instead of if statements
  // when multiple cases are handled the same way.
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
