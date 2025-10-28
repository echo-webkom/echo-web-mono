import groq from "groq";

export const headerQuery = groq`*[_id == "header" && _type == "header"][0] {
    content
}.content`;
