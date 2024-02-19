// * Reference: https://docs.snaplet.dev/core-concepts/seed
import { createSeedClient } from '@snaplet/seed';
// import { copycat } from '@snaplet/copycat'

const seed = await createSeedClient({
  dryRun: process.env.DRY !== '0',
});

// Clears all existing data in the database, but keep the structure
await seed.$resetDatabase()

await seed.authUsers([{}])
await seed.events([{}])