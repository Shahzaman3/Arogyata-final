const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB\n');

        const User = require('./models/User');

        const users = await User.find({}).select('-password -refreshToken').limit(10);

        console.log(`Found ${users.length} users:\n`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email || user.address || 'No email/address'}`);
            console.log(`   Name: ${user.name || 'N/A'}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Created: ${user.createdAt}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
