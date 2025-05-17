const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Stats = require('../models/Stats.js');
//load env
dotenv.config()
const MONGO_URI = process.env.MONGODB_URI;

// console.log(MONGO_URI)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI,
        {
            useNewUrlParser: true,
            //useUnifiedTopology: true,
        }
    );
     console.log('Registered models:', mongoose.modelNames());
     if (mongoose.models['Stats']) {
      console.log('Stats schema definition:', mongoose.models['Stats'].schema.obj);
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

// quick-fetch.js
//const mongoose = require('mongoose');

// 1. Replace with your actual Atlas URI:
//const MONGODB_URI = 'mongodb+srv://omkarkathile420:Intelliquiz_main@cluster0.dplnxlg.mongodb.net/dashboard';

// 2. Require your model so it's registered with Mongoose
// require('./models/Stats');  
// const Stats = mongoose.model('Stats');

// (async () => {
//   try {
//     // 3. Connect
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('✅ Connected to MongoDB Atlas');

//     // 4. Fetch & log
//     const allStats = await Stats.find();       // fetch all
//     console.log('📊 Stats documents:', allStats);

//     // 5. Clean exit
//     await mongoose.disconnect();
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error:', err);
//     process.exit(1);
//   }
// })();


module.exports = connectDB;

// models/Stats.js
