import { eq } from 'drizzle-orm'
import cli from '../clientSQL'
import schemaUsers from '../schemas/users'

export async function readUser({ id }: { id: string }) {
  await cli.insert(schemaUsers).values({ id }).onConflictDoNothing()
  const user = (await cli.select().from(schemaUsers).where(eq(schemaUsers.id, id)))[0]

  return {
    id: user.id,
    hashEmail: user.hashEmail
  }
}
