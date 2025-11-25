// Script to fix the test user password
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function fixUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testEmail = 'test@example.com';
        const testPassword = 'password123';

        // Delete existing user
        await User.deleteOne({ email: testEmail });
        console.log('Deleted existing test user');

        // Create new user with properly hashed password
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        const user = await User.create({
            name: 'Test User',
            email: testEmail,
            password: hashedPassword,
            role: 'patient'
        });
        console.log('Created new test user:', user.email);

        // Verify password works
        const isMatch = await bcrypt.compare(testPassword, user.password);
        console.log('Password verification:', isMatch ? '✓ SUCCESS' : '✗ FAILED');

        console.log('\nYou can now login with:');
        console.log('Email: test@example.com');
        console.log('Password: password123');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixUser();
