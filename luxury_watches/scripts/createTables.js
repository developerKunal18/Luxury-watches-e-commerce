const { sequelize } = require('../config/database');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Create all tables
const createTables = async () => {
    try {
        console.log('🔄 Creating database tables...');
        
        // Sync all models (create tables)
        await sequelize.sync({ force: false }); // Set to true to drop existing tables
        
        console.log('✅ Database tables created successfully!');
        
        // Create indexes for better performance
        console.log('🔄 Creating indexes...');
        
        // Additional indexes for activities table
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_activities_user_timestamp 
            ON activities(user_id, timestamp DESC);
        `);
        
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_activities_type_timestamp 
            ON activities(activity_type, timestamp DESC);
        `);
        
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_activities_session_timestamp 
            ON activities(session_id, timestamp DESC);
        `);
        
        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_activities_compound 
            ON activities(user_id, activity_type, timestamp DESC);
        `);
        
        console.log('✅ Indexes created successfully!');
        
        // Create a sample admin user if none exists
        const adminExists = await User.findOne({ where: { role: 'admin' } });
        if (!adminExists) {
            const adminUser = await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@luxurywatches.com',
                password: 'Admin123!', // This will be hashed automatically
                role: 'admin',
                isEmailVerified: true
            });
            
            console.log('✅ Admin user created successfully!');
            console.log('📧 Email: admin@luxurywatches.com');
            console.log('🔑 Password: Admin123!');
        }
        
        console.log('🎉 Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Error creating database tables:', error);
        throw error;
    }
};

// Run the script
if (require.main === module) {
    createTables()
        .then(() => {
            console.log('✅ Database setup completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Database setup failed:', error);
            process.exit(1);
        });
}

module.exports = { createTables };
