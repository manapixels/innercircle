const { db } = require('@vercel/postgres');
const {
  events,
  users,
} = require('./placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        image_url VARCHAR(255)
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
        INSERT INTO users (id, name, email, password, image_url)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.image_url})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedEvents(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "events" table if it doesn't exist
    const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS events (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      status TEXT CHECK (status IN ('draft','in progress', 'confirmed', 'cancelled', 'completed')) NOT NULL,
      date_start DATE NOT NULL,
      date_end DATE NOT NULL
    );
`;

    console.log(`Created "events" table`);

    // Insert data into the "events" table
    const insertedEvents = await Promise.all(
      events.map(
        async (event) => {
          return client.sql`
            INSERT INTO events (id, status, date_start, date_end)
            VALUES (${event.id}, ${event.status}, ${event.date_start}, ${event.date_end})
            ON CONFLICT (id) DO NOTHING;
          `;
        },
      ),
    );

    console.log(`Seeded ${insertedEvents.length} events`);

    return {
      createTable,
      events: insertedEvents,
    };
  } catch (error) {
    console.error('Error seeding events:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedEvents(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
