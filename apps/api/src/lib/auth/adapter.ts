// Copy of https://github.com/lucia-auth/lucia/blob/main/packages/adapter-drizzle/src/drivers/postgresql.ts
// with some modifications to make it work with our tables.
// Credit to pilcrowOnPaper and other contributors to the original file.

import { eq, lte, type InferSelectModel } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import type { Adapter, DatabaseSession, DatabaseUser, UserId } from "lucia";

import { Database } from "@echo-webkom/db/create";
import { sessions, users } from "@echo-webkom/db/schemas";

export type SessionTable = typeof sessions;
export type UserTable = typeof users;

export class DrizzleAdapter implements Adapter {
  private db: PgDatabase<any, any, any>;

  private sessionTable: SessionTable;
  private userTable: UserTable;

  constructor(db: Database, sessionTable: SessionTable, userTable: UserTable) {
    this.db = db;
    this.sessionTable = sessionTable;
    this.userTable = userTable;
  }

  public async deleteSession(sessionId: string): Promise<void> {
    await this.db.delete(this.sessionTable).where(eq(this.sessionTable.sessionToken, sessionId));
  }

  public async deleteUserSessions(userId: UserId): Promise<void> {
    await this.db.delete(this.sessionTable).where(eq(this.sessionTable.userId, userId));
  }

  public async getSessionAndUser(
    sessionId: string,
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const result = await this.db
      .select({
        user: this.userTable,
        session: this.sessionTable,
      })
      .from(this.sessionTable)
      .innerJoin(this.userTable, eq(this.sessionTable.userId, this.userTable.id))
      .where(eq(this.sessionTable.sessionToken, sessionId));
    if (result.length !== 1) return [null, null];
    return [
      transformIntoDatabaseSession(result[0].session),
      transformIntoDatabaseUser(result[0].user),
    ];
  }

  public async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
    const result = await this.db
      .select()
      .from(this.sessionTable)
      .where(eq(this.sessionTable.userId, userId));
    return result.map((val) => {
      return transformIntoDatabaseSession(val);
    });
  }

  public async setSession(session: DatabaseSession): Promise<void> {
    await this.db.insert(this.sessionTable).values({
      sessionToken: session.id,
      userId: session.userId,
      expires: session.expiresAt,
    });
  }

  public async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
    await this.db
      .update(this.sessionTable)
      .set({
        expires: expiresAt,
      })
      .where(eq(this.sessionTable.sessionToken, sessionId));
  }

  public async deleteExpiredSessions(): Promise<void> {
    await this.db.delete(this.sessionTable).where(lte(this.sessionTable.expires, new Date()));
  }
}

function transformIntoDatabaseSession(raw: InferSelectModel<SessionTable>): DatabaseSession {
  const { sessionToken, userId, expires, ...attributes } = raw;
  return {
    userId,
    id: sessionToken,
    expiresAt: expires,
    attributes,
  };
}

function transformIntoDatabaseUser(raw: InferSelectModel<UserTable>): DatabaseUser {
  const { id, ...attributes } = raw;
  return {
    id,
    attributes,
  };
}
