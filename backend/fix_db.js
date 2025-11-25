
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function fixDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('users');

        try {
            await collection.dropIndex('address_1');
            console.log('Dropped address_1 index');
        } catch (e) {
            console.log('address_1 index not found or already dropped');
        }

        try {
            await collection.dropIndex('email_1');
            console.log('Dropped email_1 index');
        } catch (e) {
            console.log('email_1 index not found or already dropped');
        }

        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixDB();
