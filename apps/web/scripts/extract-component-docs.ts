import * as fs from "node:fs";
import * as path from "node:path";
import * as docgen from "react-docgen-typescript";

const componentsDir = path.resolve(__dirname, "../src/components");
const tsconfigPath = path.resolve(__dirname, "../tsconfig.json");

const parser = docgen.withCustomConfig(tsconfigPath, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    // Keep common UI props even if they originate from @types/react
    if (["className", "children"].includes(prop.name)) return true;

    if (prop.declarations && prop.declarations.length > 0) {
      const isFromNodeModules = prop.declarations.some((decl) =>
        decl.fileName.includes("node_modules")
      );
      return !isFromNodeModules;
    }
    return true;
  },
});

function getComponentFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true, recursive: true });

  return entries
    .filter((entry) => {
      if (!entry.isFile()) return false;
      const name = entry.name;
      return (
        name.endsWith(".tsx") &&
        !name.endsWith(".test.tsx") &&
        !name.endsWith(".spec.tsx") &&
        !name.startsWith("index.")
      );
    })
    .map((entry) => {
      const parent = entry.parentPath ?? (entry as { path?: string }).path ?? dir;
      return path.join(parent, entry.name);
    });
}


const files = getComponentFiles(componentsDir);
console.log(`Found ${files.length} component files. Parsing...`);

function toSlug(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

const docs = parser.parse(files).map((comp) => {
  // Extract relative path from workspace root
  const relPath = path.relative(path.resolve(__dirname, ".."), comp.filePath);
  const slug = toSlug(comp.displayName || path.basename(comp.filePath, ".tsx"));

  return {
    ...comp,
    slug,
    filePath: relPath, // e.g. "src/components/add-to-calender.tsx"
  };
});

const outPath = path.resolve(__dirname, "../src/data/component-docs.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(docs, null, 2));

console.log(`Successfully extracted metadata for ${docs.length} components.`);