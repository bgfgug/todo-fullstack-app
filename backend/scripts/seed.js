const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
require('dotenv').config();

const User = require('../models/User');
const Todo = require('../models/Todo');

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Todo.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });

    // Create regular users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const password = await bcrypt.hash('password123', 12);
      const user = await User.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: password,
        role: 'user'
      });
      users.push(user);
    }

    console.log(`Created ${users.length + 1} users`);

    // Create todos for each user
    const allUsers = [admin, ...users];
    const priorities = ['low', 'medium', 'high'];
    let totalTodos = 0;

    for (const user of allUsers) {
      const todoCount = faker.datatype.number({ min: 5, max: 15 });
      
      for (let i = 0; i < todoCount; i++) {
        await Todo.create({
          title: faker.lorem.sentence(3),
          description: faker.lorem.paragraph(),
          completed: faker.datatype.boolean(),
          priority: priorities[faker.datatype.number({ min: 0, max: 2 })],
          dueDate: faker.datatype.boolean() ? faker.date.future() : null,
          userId: user._id
        });
        totalTodos++;
      }
    }

    console.log(`Created ${totalTodos} todos`);
    console.log('Seeding completed successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Regular users: Check the database for generated emails / password123');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

seedDatabase();