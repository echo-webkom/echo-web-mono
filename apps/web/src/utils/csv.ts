import { json2csv } from "json-2-csv";

/**
 * NestedKeyOf is a mapped type that recursively traverses the keys of ObjectType and its nested objects, and constructs a union of the keys in the format key.subkey
 * This allows TypeScript to recognize internal keys as valid input to includeKeys.
 */
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & (string | number)];

/**
 * This function is a wrapper around json2csv that allows us to use includeKeys, instead of excludeKeys.
 * We want includeKeys instead because it future-proofs the function against new keys being added to the object.
 */
function toCsv<TObj extends object>(
  objList: Array<TObj>,
  includeKeys: Array<NestedKeyOf<TObj>>,
): string {
  const excludeKeys = includeKeys ? (getExcludeKeys(includeKeys, objList) as Array<string>) : [];

  return json2csv(objList, {
    excelBOM: true,
    emptyFieldValue: "",
    excludeKeys,
    expandNestedObjects: true,
    expandArrayObjects: true,
  });
}

/**
 * This function takes in a list of objects and a list of keys to include, and returns a list of keys to exclude.
 * NB: This function assumes that all objects in the list have the same keys.
 */
function getExcludeKeys<TObj extends object>(
  includeKeys: Array<NestedKeyOf<TObj>>,
  objList: Array<TObj>,
): typeof includeKeys {
  if (!objList[0]) {
    throw new Error("Obj is empty");
  }
  const keys = getNestedObjectKeys(objList[0]);
  let excludeKeys = keys.filter((key) => !includeKeys.includes(key));

  // If a child key is included, we dont want to exclude the parent key
  for (const key of includeKeys as Array<string>) {
    const parentKey = key.split(".").slice(0, -1).join(".");
    excludeKeys = excludeKeys.filter((k) => k !== parentKey);
  }
  return excludeKeys;
}

// TODO this function is not working as expected. It causes an error.
function getNestedObjectKeys<TObj extends object>(obj: TObj): Array<NestedKeyOf<TObj>> {
  const objectKeys: Array<string> = [];
  const stack = [{ obj, path: "" }];

  console.log("obj", obj);
  while (stack.length > 0) {
    const { obj: currentObj, path: currentPath } = stack.pop()!;

    console.log("\n\n\n stack -----------------------------------------");
    // console.log("currentObj", currentObj);
    console.log(stack);
    Object.keys(currentObj).forEach((key) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      const newObject = currentObj[key as keyof typeof currentObj];

      if (typeof newObject === "object" && newObject) {
        objectKeys.push(newPath);
        stack.push({ obj: newObject as TObj, path: newPath });
      } else {
        objectKeys.push(newPath);
      }

      // if (typeof newObject !== "object") {
      //   objectKeys.push(newPath);
      // } else {
      //   objectKeys.push(newPath);
      //   stack.push({ obj: newObject as TObj, path: newPath });
      // }
    });
  }

  return objectKeys as Array<NestedKeyOf<TObj>>;
}

export default toCsv;
