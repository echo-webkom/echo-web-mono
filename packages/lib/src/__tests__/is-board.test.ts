import { assertEquals } from "jsr:@std/assert";

import { isBoard } from "../is-board.ts";

Deno.test("should return true for a valid board", () => {
  assertEquals(isBoard("1/2"), true);
  assertEquals(isBoard("2003/5004"), true);
  assertEquals(isBoard("2023/2024"), true);
});

Deno.test("should return false for an invalid board", () => {
  assertEquals(isBoard("1/2/3"), false);
  assertEquals(isBoard("webkom"), false);
  assertEquals(isBoard("hell/hallo"), false);
  assertEquals(isBoard("2"), false);
});
