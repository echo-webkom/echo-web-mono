import { MovieClubCard } from "@/components/movie-club-card";
import { BentoBox } from "./bento-box";

export const FilmklubbMovies = ({ className }: { className?: string }) => {
  return (
    <BentoBox title="Mandagens Visning" className={className}>
      <MovieClubCard />
    </BentoBox>
  );
};
