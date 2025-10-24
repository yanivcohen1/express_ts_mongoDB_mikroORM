import { connectDatabase, disconnectDatabase } from './src/config/database';
import { User } from './src/models/User';

async function createUsers() {
  await connectDatabase();

  const users = [
    { username: 'admin@example.com', password: 'Admin123!', role: 'admin' as const },
    { username: 'user@example.com', password: 'User123!', role: 'user' as const }
  ];

  for (const userData of users) {
    try {
      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping.`);
        continue;
      }

      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.username}`);
    } catch (error) {
      console.error(`Error creating user ${userData.username}:`, error);
    }
  }

  await disconnectDatabase();
  console.log('User creation script completed.');
}

createUsers().catch(console.error);