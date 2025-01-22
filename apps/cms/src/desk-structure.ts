import { ListItemBuilder, type StructureBuilder } from "sanity/structure";

const hiddenDocuments = ["media.tag"];

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Generelt")
    .items([
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !hiddenDocuments.includes(listItem.getId() ?? "") && listItem.getId() !== "banner",
      ),
      S.listItem()
        .title("Banner")
        .id("banner")
        .child(S.document().schemaType("banner").documentId("banner")),
    ]);
