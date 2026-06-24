const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Error: MONGODB_URI is not set in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);

    if (uri.includes('mongodb+srv') && error.message.includes('whitelist')) {
      console.error(
        'Atlas IP blocked. Add your IP in MongoDB Atlas → Network Access, or use local MongoDB:\n' +
          '  MONGODB_URI=mongodb://127.0.0.1:27017/cargo_delivery'
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
