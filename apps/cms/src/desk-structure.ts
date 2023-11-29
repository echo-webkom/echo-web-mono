import { type StructureBuilder } from "sanity/desk";

const hiddenDocuments = ["siteSettings", "media.tag"];

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Generelt")
    .items([
      // S.listItem()
      //   .title("Sideinnstillinger")
      //   .icon(CogIcon)
      //   .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      // S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenDocuments.includes(listItem.getId() ?? ""),
      ),
    ]);
