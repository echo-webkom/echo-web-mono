import { z } from "zod";

// get zod object keys recursively
export const zodKeys = <T extends z.ZodTypeAny>(schema: T): Array<string> => {
	// make sure schema is not null or undefined
	if (schema === null || schema === undefined) return [];
	// check if schema is nullable or optional
	if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional) return zodKeys(schema.unwrap());
	// check if schema is an array
	if (schema instanceof z.ZodArray) return zodKeys(schema.element);
	// check if schema is an object
	if (schema instanceof z.ZodObject) {
		// get key/value pairs from schema
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const entries = Object.entries(schema.shape);
		// loop through key/value pairs
		return entries.flatMap(([key, value]) => {
			// get nested keys
			const nested = value instanceof z.ZodType ? zodKeys(value).map((subKey) => `${key}.${subKey}`) : [];
			// return nested keys
			return nested.length ? nested : key;
		});
	}
	// return empty array
	return [];
};
