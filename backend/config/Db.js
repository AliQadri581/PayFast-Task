// import mongoose from "mongoose";
// import dotenv from 'dotenv'
// const connectDB = async () => {
//   try {
//     console.log(process.env.MONGO_URI);
//     await mongoose.connect("mongodb://127.0.0.1:27017/PayFast", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected`);
//   } catch (error) {
//     console.error(`ERROR: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";
import dotenv from 'dotenv'
const connectDB = async () => {
  try {
    
    await mongoose.connect("mongodb+srv://alihussainqadri6:56c2msJjEfdT45GE@payfast-db.qs8dr.mongodb.net/?retryWrites=true&w=majority&appName=Payfast-DB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;