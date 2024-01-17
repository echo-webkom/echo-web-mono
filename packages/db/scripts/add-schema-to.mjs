import { promises as fs } from "fs";

/**
 * Migrates all the snapshots in `./drizzle/migrations/meta` to add the `schemaTo` property to all the foreign keys.
 *
 * drizzle-kit version 0.20.9 to 0.20.10
 */

const META_FOLDER = "./drizzle/migrations/meta";

void (async () => {
  const snapshots = await fs.readdir(META_FOLDER).then((files) => {
    return files.filter((file) => file.endsWith("snapshot.json"));
  });

  snapshots.forEach(async (snapshot) => {
    const snapshotFile = await fs
      .readFile(`${META_FOLDER}/${snapshot}`, "utf-8")
      .then((file) => JSON.parse(file));

    const tables = Object.keys(snapshotFile.tables);

    tables.forEach((table) => {
      const foreignKeys = Object.keys(snapshotFile["tables"][table]?.foreignKeys ?? {});

      foreignKeys.forEach((foreignKey) => {
        snapshotFile["tables"][table]["foreignKeys"][foreignKey]["schemaTo"] = "public";
      });
    });

    await fs.writeFile(`${META_FOLDER}/${snapshot}`, `${JSON.stringify(snapshotFile, null, 2)}\n`);
  });
})();
