import SongRoulette from "@/components/SongRoulette";
import { getAllSongs } from "@/lib/youtube";

export const revalidate = 3600;

export default async function HomePage() {
  const songs = await getAllSongs();
  return <SongRoulette songs={songs} />;
}
