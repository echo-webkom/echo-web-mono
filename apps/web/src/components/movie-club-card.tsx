import Image from "next/image";
import { movies } from "@/sanity/movies";

export default function MovieClubCard() {
  return (
    <div>
      <Image src={movies.image} alt={movies.title}></Image>
      <ul>
        <li>
          <span className="font-semibold">Tittel:</span> {movies.title}
        </li>
        <li>
          <span className="font-semibold">Sted:</span> Store Aud
        </li>
        <li>
          <span className="font-semibold">Dato:</span> {movies.datetime}
        </li>
      </ul>
    </div>
  );
}
