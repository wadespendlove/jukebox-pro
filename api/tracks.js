import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser.js";
import { getPlaylistsByTrackIdAndUserId } from "#db/queries/playlists.js";

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.route("/:id/playlists", requireUser, async (req, res) => {
  const trackId = req.params.id;
  const playlists = await getPlaylistsByTrackIdAndUserId(trackId, req.user.id);
  res.send(playlists);
});
