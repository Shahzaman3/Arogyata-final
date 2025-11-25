// Test script to create a user and test login
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function testLogin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create a test user
        const testEmail = 'test@example.com';
        const testPassword = 'password123';

        // Check if user exists
        let user = await User.findOne({ email: testEmail });

        if (user) {
            console.log('User already exists:', user.email);
        } else {
            // Create new user with hashed password
            const hashedPassword = await bcrypt.hash(testPassword, 10);
            user = await User.create({
                name: 'Test User',
                email: testEmail,
                password: hashedPassword,
                role: 'patient'
            });
            console.log('Created test user:', user.email);
        }

        // Test password comparison
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log('Password match test:', isMatch);

        // List all users
        const allUsers = await User.find({});
        console.log('\nAll users in database:');
        allUsers.forEach(u => {
            console.log(`- ${u.email || u.address} (${u.role})`);
        });

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testLogin();
