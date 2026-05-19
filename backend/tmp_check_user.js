const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne().select('-password').lean();
    console.log('user found', user ? { email: user.email, fullname: user.fullname } : null);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();