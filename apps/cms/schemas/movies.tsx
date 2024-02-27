import {defineType, defineField} from "sanity";

export default defineType({
    name: "movie",
    title: "Film",
    type: "document",
    fields: [
        defineField({
            name: "title",
            title: "Tittel",
            type: "string",
        }),
        defineField({
            name: "date",
            title: "Dato",
            description: "Dato og tid for film",
            type: "datetime",
        }),
        defineField({
            name: "image",
            title: "Bilde",
            type: "image",
        }),
        defineField({
            name: "link",
            title: "Lenke til IMDb",
            type: "url",
        })
    ]
})