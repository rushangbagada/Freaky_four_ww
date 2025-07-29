const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Prediction_user = require('./models/prediction_user');

// Load environment variables
dotenv.config();

async function checkUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await Prediction_user.find({});
    console.log(`\n📊 Found ${users.length} users in the database:`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`);
      console.log(`   MongoDB _id: ${user._id}`);
      console.log(`   Custom id: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Total Points: ${user.total_point}`);
    });

    // Check if the specific user ID exists
    const targetUserId = '6868bd2405488200315811b8';
    console.log(`\n🔍 Checking for user with ID: ${targetUserId}`);
    
    const userById = await Prediction_user.findById(targetUserId);
    if (userById) {
      console.log('✅ User found by MongoDB _id:', userById);
    } else {
      console.log('❌ User not found by MongoDB _id');
    }
    
    const userByCustomId = await Prediction_user.findOne({ id: targetUserId });
    if (userByCustomId) {
      console.log('✅ User found by custom id:', userByCustomId);
    } else {
      console.log('❌ User not found by custom id');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
  }
}

checkUsers();
