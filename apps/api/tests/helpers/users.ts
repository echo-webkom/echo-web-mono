import bcrypt from "bcryptjs";

import {
  db,
  passwords,
  users,
  type AccountType,
  type Degree,
  type Year,
} from "@echo-webkom/storage";

type InsertUserOptions = Partial<{
  firstName?: string;
  lastName?: string;
  email?: string;
  degree?: Degree;
  year?: Year;
  type?: AccountType;
  password?: string;
}>;

/**
 * Inserts a student user into the database
 *
 * Default values are:
 * - First name: Test
 * - Last name: Test
 * - Email: test@test.com
 * - Degree: dtek
 * - Year: first
 * - Type: student
 */
export const insertUser = async ({
  firstName = "Test",
  lastName = "Test",
  email = "test@test.com",
  degree = "dtek",
  year = "first",
  type = "student",
  password = "password123",
}: InsertUserOptions = {}) => {
  const user = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      type,
      degree,
      year,
    })
    .returning();

  if (!user[0]) {
    throw new Error("Could not insert user");
  }

  const userPassword = await db
    .insert(passwords)
    .values({
      userId: user[0]!.id,
      password: bcrypt.hashSync(password, 10),
    })
    .returning();

  if (!userPassword[0]) {
    throw new Error("Could not insert password");
  }

  return {
    user: user[0]!,
    password: userPassword[0]!.password,
  };
};
