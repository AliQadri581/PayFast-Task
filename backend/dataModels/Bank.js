import mongoose from 'mongoose';

const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
    unique: true,  
  },
  bankId: {
    type: String,
    required: true, 
    unique: true,  
  }
}, { timestamps: true });

const Bank = mongoose.model('Bank', bankSchema);

export default Bank;  
