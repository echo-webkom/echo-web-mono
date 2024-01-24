import { CogIcon } from "@sanity/icons";
import { type StructureBuilder } from "sanity/desk";

const hiddenDocuments = ["settings", "media.tag"];

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("Generelt")
    .items([
      S.listItem()
        .title("Innstillinger")
        .icon(CogIcon)
        .child(S.document().schemaType("settings").documentId("settings")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenDocuments.includes(listItem.getId() ?? ""),
      ),
    ]);
