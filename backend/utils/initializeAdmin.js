const User = require('../models/User');

const initializeAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    
    if (!adminExists) {
      // Create default admin user
      const admin = new User({
        name: 'Admin User',
        email: 'admin@admin.com',
        phone: '1234567890',
        password: 'Admin@123', // Will be hashed by pre-save hook
        state: 'Default',
        city: 'Default',
        country: 'Default',
        pincode: '12345',
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Default admin user created');
      console.log('   Email: admin@admin.com');
      console.log('   Password: Admin@123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
  }
};

module.exports = { initializeAdmin };

