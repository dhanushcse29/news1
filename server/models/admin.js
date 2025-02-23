const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

// Create default admin if none exists
async function createDefaultAdmin() {
    try {
        const count = await Admin.countDocuments();
        if (count === 0) {
            await Admin.create({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            });
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

createDefaultAdmin();

module.exports = Admin; 