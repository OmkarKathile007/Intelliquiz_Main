// const mongoose = require('mongoose');
// const dotenv = require('dotenv')
// const Stats = require('../models/Stats.js');
// dotenv.config()
// const MONGO_URI = process.env.MONGODB_URI;

// // console.log(MONGO_URI)
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(MONGO_URI,
//         {
//             useNewUrlParser: true,
//             //useUnifiedTopology: true,
//         }
//     );
//      console.log('Registered models:', mongoose.modelNames());
//      if (mongoose.models['Stats']) {
//       console.log('Stats schema definition:', mongoose.models['Stats'].schema.obj);
//     }

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(error.message);
//     process.exit(1);
//   }
// }



// module.exports = connectDB;


const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log('Registered models:', mongoose.modelNames());

    if (mongoose.models['Stats']) {
      console.log('Stats schema definition:', mongoose.models['Stats'].schema.obj);
    }

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Error (non-fatal):", error.message);
    console.warn("Server continuing without MongoDB — multiplayer/socket features will still work.");
  }
};

module.exports = connectDB;
