import { promises as fs } from "fs";

/**
 * Migrates all the snapshots in `./drizzle/migrations/meta` to add the `schemaTo` property to all the foreign keys.
 *
 * drizzle-kit version 0.20.9 to 0.20.10
 */

const META_FOLDER = "./drizzle/migrations/meta";

void (async () => {
  // Read all the files in `./drizzle/meta`
  const snapshots = await fs.readdir(META_FOLDER).then((files) => {
    return files.filter((file) => file.endsWith("snapshot.json"));
  });

  snapshots.forEach(async (snapshot) => {
    // Read the snapshot file
    const snapshotFile = await fs.readFile(`${META_FOLDER}/${snapshot}`, "utf-8");
    const snapshotJson = JSON.parse(snapshotFile);

    const tables = Object.keys(snapshotJson.tables);

    tables.forEach((table) => {
      const foreignKeys = Object.keys(snapshotJson["tables"][table]?.foreignKeys ?? {});

      foreignKeys.forEach((foreignKey) => {
        snapshotJson["tables"][table]["foreignKeys"][foreignKey]["schemaTo"] = "public";
      });
    });

    await fs.writeFile(`${META_FOLDER}/${snapshot}`, `${JSON.stringify(snapshotJson, null, 2)}\n`);
  });
})();
