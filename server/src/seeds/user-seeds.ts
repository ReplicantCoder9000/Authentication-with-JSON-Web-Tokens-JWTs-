import { User } from '../models/user.js';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash('password', 10);
  await User.bulkCreate([
    { username: 'JollyGuru', password: hashedPassword },
    { username: 'SunnyScribe', password: hashedPassword },
    { username: 'RadiantComet', password: hashedPassword },
  ], {
    individualHooks: true // This ensures beforeCreate hook runs for each record
  });
};
