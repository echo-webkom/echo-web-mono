import { comments } from "@echo-webkom/db/schemas";

import { db } from "@/lib/db";
import { givenIHaveUsers } from "./users";

export async function givenIHaveComments() {
  await givenIHaveUsers();

  await db
    .insert(comments)
    .values([
      {
        content: "This is a comment",
        postId: "1",
        userId: "1",
      },
      {
        content: "This is another comment",
        postId: "1",
        userId: "2",
      },
    ])
    .onConflictDoNothing();
}
