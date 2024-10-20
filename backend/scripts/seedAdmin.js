const dbClient = require('../utils/db');
const bcrypt = require('bcrypt');

const seedAdminAccount = async () => {
    try {
        await dbClient.client.connect();
        const db = dbClient.client.db('quiz-app');
        const usersCollection = db.collection('users');
        
        // Check if admin user already exists
        const admin = await usersCollection.findOne({ role: 'admin' });

        if (!admin) {
            console.log('Seeding admin account...');

            const hashedPassword = await bcrypt.hash('4k!uhd.TV', 10); // Use a strong password

            // Insert default admin user
            const adminData = {
                username: 'admin',
                email: 'btorfu@proton.me',
                password: hashedPassword, // Store the hashed password
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await usersCollection.insertOne(adminData);
            console.log('Admin account seeded successfully');
        } else {
            console.log('Admin account already exists');
        }
    } catch (error) {
        console.error('Error seeding admin account:', error);
    } finally {
        await dbClient.client.close();
    }
};

seedAdminAccount();
