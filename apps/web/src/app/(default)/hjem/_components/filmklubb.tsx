import { unoWithAdmin } from "@/api/server";
import { MovieClubCard } from "@/components/movie-club-card";
import { BentoBox } from "./bento-box";

export const FilmklubbMovies = async ({ className }: { className?: string }) => {
  const movies = await unoWithAdmin.sanity.movies.upcoming(3).catch(() => []);

  // Hide the entire section if there are no movies at all
  if (movies.length === 0) {
    return null;
  }

  return (
    <BentoBox title="Mandagens Visning" className={className}>
      <MovieClubCard />
    </BentoBox>
  );
};
