import { CogIcon } from "@sanity/icons";
import { type StructureBuilder } from "sanity/structure";

const hiddenDocuments = ["media.tag", "settings"];

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Generelt")
    .items([
      S.listItem()
        .title("Innstillinger")
        .child(S.document().schemaType("settings"))
        .icon(CogIcon)
        .id("settings"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenDocuments.includes(listItem.getId() ?? ""),
      ),
    ]);
