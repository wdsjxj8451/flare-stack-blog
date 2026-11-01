import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { afterEach, expect, it } from "vitest";
import { findOwnerGithubAvatar } from "./auth.data";

const databases: DatabaseSync[] = [];
function setup() {
  const sqlite = new DatabaseSync(":memory:");
  databases.push(sqlite);
  // Intentionally no email or token columns: the public lookup needs neither.
  sqlite.exec(
    "CREATE TABLE user (id TEXT, role TEXT, created_at INTEGER); CREATE TABLE account (user_id TEXT, provider_id TEXT, account_id TEXT);",
  );
  const db = drizzle(async (sql, params) => ({
    rows: sqlite
      .prepare(sql)
      .all(...params)
      .map((row) => Object.values(row)),
  }));
  return { sqlite, db: db as unknown as DB };
}
afterEach(() => {
  databases.splice(0).forEach((db) => db.close());
});

it("returns no avatar before an Admin links GitHub", async () => {
  const { sqlite, db } = setup();
  sqlite.exec(
    "INSERT INTO user VALUES ('reader','user',1),('owner','admin',2); INSERT INTO account VALUES ('reader','github','9'),('owner','credential','owner');",
  );
  expect(await findOwnerGithubAvatar(db)).toBeNull();
});

it("uses the earliest GitHub Admin, excluding readers and other providers", async () => {
  const { sqlite, db } = setup();
  sqlite.exec(
    "INSERT INTO user VALUES ('reader','user',1),('email-admin','admin',2),('owner','admin',3),('other-admin','admin',4); INSERT INTO account VALUES ('reader','github','9'),('email-admin','credential','owner'),('owner','github','42'),('other-admin','github','43');",
  );
  expect(await findOwnerGithubAvatar(db)).toBe(
    "https://avatars.githubusercontent.com/u/42?s=160&v=4",
  );
});

it("rejects a malformed provider ID instead of making an arbitrary image URL", async () => {
  const { sqlite, db } = setup();
  sqlite.exec(
    "INSERT INTO user VALUES ('owner','admin',1); INSERT INTO account VALUES ('owner','github','../private');",
  );
  expect(await findOwnerGithubAvatar(db)).toBeNull();
});
