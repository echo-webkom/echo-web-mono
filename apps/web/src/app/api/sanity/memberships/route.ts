import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import * as s from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";
import { client } from "@echo-webkom/sanity";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";
import { fetchStudentGroupsByProfileId } from "@/sanity/student-group";

type DeltaOperation = "create" | "update" | "delete";

type StudentGroupProjection = {
  operation: DeltaOperation;
  _type: "studentGroup";
  _id: string;
  data: {
    slug: string;
    members: Array<{
      profile: {
        _id: string;
        userId: string | null;
      };
    }>;
  };
};

type ProfileProjection = {
  operation: DeltaOperation;
  _type: "profile";
  _id: string;
  data: {
    userId: string | null;
  };
};

type WebhookProjection = StudentGroupProjection | ProfileProjection;

/**
 * Endpoint to automatically update the memberships of groups when a user is
 * added or removed from a group in Sanity.
 *
 *
 * ## Fires on, create, update and delete of:
 *
 * ```
 * _type == "studentGroups" || _type == "profile"
 * ```
 *
 * ## Webhook projection:
 *
 * ```
 * {
 *   "operation": delta::operation(),
 *   "_type": _type,
 *   "_id": _id,
 *   "data": {
 *     "userId": userId,      // Only for profile type
 *     "slug": slug.current,
 *     "members": members[] {
 *       "profile": profile->{
 *         _id,
 *         name,
 *         userId,
 *       },
 *     },
 *   }
 * }
 * ```
 */
export const POST = withBasicAuth(async (req) => {
  try {
    const json = (await req.json()) as WebhookProjection;

    if (json._type === "studentGroup") {
      return await handleStudentGroupProjection(json);
    } else if (json._type === "profile") {
      return await handleProfileProjection(json);
    }

    // 200 OK because we don't want to retry
    return new Response("Unknown projection type", { status: 200 });
  } catch (error) {
    if (error instanceof TypeError) {
      // 200 OK because we don't want to retry
      return new Response("Bad request", { status: 200 });
    }

    return new Response("Internal server error", { status: 500 });
  }
});

async function handleStudentGroupProjection(json: StudentGroupProjection): Promise<Response> {
  // We assume that the slug is the groupId in our database.
  const groupId = json.data.slug;

  // If the student group is deleted, remove all memberships.
  if (json.operation === "delete") {
    console.info(`Deleting all memberships for deleted group ${groupId}.`);

    await db.delete(s.usersToGroups).where(eq(s.usersToGroups.groupId, groupId));

    return new Response("Group memberships deleted", { status: 200 });
  }

  const success = await updateGroupMemberships(groupId, json.data.members);

  if (!success) {
    // 200 OK because we don't want to retry
    return new Response("Group does not exist", { status: 200 });
  }

  return new Response("Group memberships updated", { status: 200 });
}

async function handleProfileProjection(json: ProfileProjection): Promise<Response> {
  // Check if profile has userId, if not we can ignore it
  if (!json.data.userId) {
    console.info(`Profile ${json._id} has no userId, skipping.`);
    return new Response("Profile has no userId", { status: 200 });
  }

  // If profile is deleted, we don't need to do anything as memberships
  // are handled by the student group updates
  if (json.operation === "delete") {
    console.info(`Profile ${json._id} deleted, no action needed.`);
    return new Response("Profile deleted", { status: 200 });
  }

  // Get all student groups that this profile is a member of
  const studentGroups = await fetchStudentGroupsByProfileId(json._id);

  if (!studentGroups.length) {
    console.info(`Profile ${json._id} is not a member of any groups.`);
    return new Response("Profile not member of any groups", { status: 200 });
  }

  // For each group, fetch the current membership data and update
  let updatedGroups = 0;
  for (const group of studentGroups) {
    const groupData = await client.fetch<{
      slug: { current: string };
      members: Array<{
        profile: {
          _id: string;
          userId: string | null;
        };
      }>;
    }>(
      `*[_type == "studentGroup" && slug.current == $slug][0] {
      slug,
      "members": members[] {
        "profile": profile->{
          _id,
          userId
        }
      }
    }`,
      { slug: group.slug },
    );

    if (groupData) {
      const success = await updateGroupMemberships(groupData.slug.current, groupData.members);
      if (success) {
        updatedGroups++;
      }
    }
  }

  revalidateTag("student-groups");

  console.info(`Updated ${updatedGroups} groups for profile ${json._id}.`);
  return new Response(`Updated ${updatedGroups} group memberships`, { status: 200 });
}

async function updateGroupMemberships(
  groupId: string,
  members: Array<{ profile: { _id: string; userId: string | null } }>,
) {
  // Validate that the group exists.
  const studentGroup = await db.query.groups.findFirst({
    where: eq(s.groups.id, groupId),
  });

  if (!studentGroup) {
    console.warn(`Group with id ${groupId} does not exist.`);
    return false;
  }

  // Extract the userIds of the members to update.
  const membersToUpdate = members
    .filter((member) => Boolean(member.profile?.userId))
    .map((member) => member.profile.userId!); // Safely cast as non-null due to filter.

  // If there are not members to update, we can stop here.
  if (!membersToUpdate.length) {
    console.info(`No members to update for ${groupId}.`);
    return true;
  }

  // Remove all existing memberships for the group.
  await db.delete(s.usersToGroups).where(eq(s.usersToGroups.groupId, groupId));

  // Add all new memberships.
  await db
    .insert(s.usersToGroups)
    .values(
      membersToUpdate.map((userId) => ({
        userId,
        groupId,
      })),
    )
    .onConflictDoNothing()
    .execute();

  console.info(`Updated memberships for group ${groupId}.`);
  return true;
}
