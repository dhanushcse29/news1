require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Admin = require('../server/models/admin');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function createAdmin() {
    try {
        const admin = new Admin({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            email: process.env.ADMIN_EMAIL
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin(); 