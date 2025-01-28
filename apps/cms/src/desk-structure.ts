import {
  filteredDocumentListItems,
  singletonDocumentListItems,
} from "sanity-plugin-singleton-tools";
import { type StructureBuilder, type StructureResolverContext } from "sanity/structure";

export const deskStructure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .title("Generelt")
    .items([
      ...singletonDocumentListItems({ S, context }),
      S.divider(),
      ...filteredDocumentListItems({ S, context }).filter((item) => item.getId() !== "media.tag"),
    ]);
