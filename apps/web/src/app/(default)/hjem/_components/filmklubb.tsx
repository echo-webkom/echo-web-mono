import { MovieClubCard } from "@/components/movie-club-card";
import { fetchNewestMovie } from "@/sanity/movies";
import { BentoBox } from "./bento-box";

export const FilmklubbMovies = async ({ className }: { className?: string }) => {
  const movies = await fetchNewestMovie(3);

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
