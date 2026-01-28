import { connectDatabase, disconnectDatabase, orm } from './src/config/database';
import { User } from './src/models/User';
import { hashPassword } from './src/lib/password';

async function createUsers() {
  await connectDatabase();
  const em = orm.em.fork();

  const users = [
    { username: process.env.AUTH_ADMIN_USERNAME || 'admin@example.com', password: process.env.AUTH_ADMIN_PASSWORD || 'Admin123!', role: 'admin' as const },
    { username: process.env.AUTH_USER_USERNAME || 'user@example.com', password: process.env.AUTH_USER_PASSWORD || 'User123!', role: 'user' as const }
  ];

  for (const userData of users) {
    try {
      const existingUser = await em.findOne(User, { username: userData.username });
      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping.`);
        continue;
      }

      const hashedPassword = await hashPassword(userData.password);
      const user = em.create(User, { ...userData, password: hashedPassword });
      await em.persistAndFlush(user);
      console.log(`Created user: ${userData.username}`);
    } catch (error) {
      console.error(`Error creating user ${userData.username}:`, error);
    }
  }

  await disconnectDatabase();
  console.log('User creation script completed.');
}

createUsers().catch(console.error);