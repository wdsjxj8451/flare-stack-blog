import { and, asc, eq } from "drizzle-orm";
import { account, user } from "@/lib/db/schema";

/** Public GitHub profile image only; never select provider tokens or email. */
export async function findOwnerGithubAvatar(db: DB) {
  const [owner] = await db
    .select({ githubId: account.accountId })
    .from(user)
    .innerJoin(account, eq(account.userId, user.id))
    .where(and(eq(user.role, "admin"), eq(account.providerId, "github")))
    .orderBy(asc(user.createdAt), asc(user.id))
    .limit(1);
  return owner && /^\d+$/.test(owner.githubId)
    ? `https://avatars.githubusercontent.com/u/${owner.githubId}?s=160&v=4`
    : null;
}

export async function findAdminEmail(db: DB) {
  const [admin] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.role, "admin"))
    .orderBy(asc(user.createdAt))
    .limit(1);
  return admin?.email ?? null;
}
