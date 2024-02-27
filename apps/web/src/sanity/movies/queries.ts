import { groq } from "next-sanity";

export const moviesQuery = groq`*[_type == "movie"] {
    title,
    date,
    link,
    image,
}
`;
