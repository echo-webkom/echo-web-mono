import { defineField, defineType } from "sanity";

export default defineType({
    name: "hungerGames",
    title: "Hunger Games",
    type: "document",
    fields: [
        defineField({
            name: "profile",
            title: "Profil",
            type: "reference",
            to: { type: "profile" },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "isDead",
            title: "Er død?",
            type: "boolean",
            
        })
    ],
    initialValue: {
        isDead: false
    }
})