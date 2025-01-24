import { User } from '../models/user.js';
import { seedUsers } from './user-seeds.js';
import { seedTickets } from './ticket-seeds.js';

export const seedProduction = async () => {
  try {
    // Check if users exist
    const existingUsers = await User.findAll();
    
    // Only seed if no users exist
    if (existingUsers.length === 0) {
      console.log('Seeding production database...');
      await seedUsers();
      await seedTickets();
      console.log('Production database seeded successfully');
    } else {
      console.log('Database already contains data, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding production database:', error);
    throw error;
  }
};
