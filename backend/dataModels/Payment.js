import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  bankId: {
    type: String,
  },
  bankAccountNumber: {
    type: String,
    required: true 
  },
  bankName: {
    type: String,
    required: true 
  },
  cnic: {
    type: String,
    required: true,
    match: /^[0-9]{5}-[0-9]{7}-[0-9]$/ 
  },
  mobileNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true 
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
