import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }
  for (let i = 1; i <= 3; i++) {
    const user = await createUser("user" + i, "password");
    const playlist = await createPlaylist(
      "Playlist " + i,
      "lorem ipsum playlist description",
      user.id
    );
    for (let i2 = 0; i2 < 5; i2++) {
      const trackId = (i2 - 1) * 5 + i2 + 1;
      await createPlaylistTrack(playlist.id, trackId);
    }
  }
}
