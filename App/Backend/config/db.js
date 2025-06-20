const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Stats = require('../models/Stats.js');
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



module.exports = connectDB;

//const MONGODB_URI = process.env.MONGO_URI;


// require('./models/Stats');  
// const Stats = mongoose.model('Stats');

// (async () => {
//   try {
//
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB Atlas');

//     // 4. Fetch & log
//     const allStats = await Stats.find();       // fetch all
//     console.log('📊 Stats documents:', allStats);

//     // 5. Clean exit
//     await mongoose.disconnect();
//     process.exit(0);
//   } catch (err) {
//     console.error(' Error:', err);
//     process.exit(1);
//   }
// })();


module.exports = connectDB;

// models/Stats.js
