import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/Db.js'
import Payment from './dataModels/Payment.js';
import cors from 'cors';
import Bank from './dataModels/Bank.js'
import axios from 'axios';
dotenv.config()
const port = process.env.PORT || 5000

connectDB()
 const app = express()

 app.use(express.json())
 app.use(express.urlencoded({extended: true}))
//  app.use(cookieParser())

 app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
}))

 app.get("/", (req,res) =>{
    res.send("Hello Everyone")
 })


app.post('/api/payments', async (req, res) => {
  const { amount, email, address, bankId, cnic, mobileNumber, bankAccountNumber, bankName } = req.body;

  // CNIC format validation
  const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
  if (!cnicRegex.test(cnic)) {
    return res.status(400).json({ error: 'Invalid CNIC format' });
  }

  try {
    const payment = new Payment({
      amount,
      email,
      address,
      bankId,
      bankAccountNumber,
      bankName,
      cnic,
      mobileNumber,
    });

    await payment.save();
    res.status(201).json({ message: 'Payment saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving payment', details: error.message });
    console.log(error);
    console.log(error.message);
  }
});


// app.post('/api/convert', async (req, res) => {
//   const { fromCurrency, amount } = req.body;
//   try {
//     // API request to get the conversion rate from external API
//     const response = await axios.get(
//       `https://api.apilayer.com/exchangerates_data/convert?to=PKR&from=${fromCurrency}&amount=${amount}`,
//       {
//         headers: { apikey: 'TOzThjDj7jIkVIDUclqCWE6H10TW1W9G' }
//       }
//     );
//     const convertedAmount = response.data.result;
//     res.json({ convertedAmount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching exchange rate', details: error.message });
//   }
// });


app.post('/api/convert', async (req, res) => {
  const { fromCurrency, amount } = req.body;
  try {

    if (!fromCurrency || !amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/dfa52f17011d72c3bcaa8ac7/latest/${fromCurrency}`
    );

    if (!response.data.conversion_rates || !response.data.conversion_rates.PKR) {
      return res.status(400).json({ error: 'Conversion rate for PKR not found' });
    }
    const conversionRate = response.data.conversion_rates.PKR;
    const convertedAmount = (amount * conversionRate).toFixed(2);
    res.json({ convertedAmount });
  } catch (error) {
    console.error('Error in conversion:', error);
    res.status(500).json({ error: 'Error fetching exchange rate', details: error.message });
  }
});


  app.get('/api/banks/:bankName', async (req, res) => {
    const { bankName } = req.params;
    
    try {
      const bank = await Bank.findOne({ bankName: bankName });
      if (bank) {
        res.json({ bankId: bank.bankId });
      } else {
        res.status(404).json({ error: 'Bank not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bank data', details: error.message });
    }
  });



app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Payment.find(); 
    res.json(transactions); 
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions', details: error.message });
  }
});

app.post('/api/banks', async (req, res) => {
  const { bankName, bankId } = req.body;

  if (!bankName || !bankId) {
    return res.status(400).json({ error: 'Bank name and ID are required' });
  }
  try {
 
    const newBank = new Bank({
      bankName,
      bankId
    });
    const savedBank = await newBank.save();
    res.status(201).json({
      message: 'Bank saved successfully!',
      bank: savedBank
    });
  } catch (error) {
    console.error('Error saving bank:', error);
    res.status(500).json({ error: 'Error saving bank', details: error.message });
  }
});


app.get('/api/transactions/search/:type/:query', async (req, res) => {
  const { type, query } = req.params;

  if (!query) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    let transactions = [];

    if (type === 'mobileNumber') {
      transactions = await Payment.find({ mobileNumber: query });
    } else if (type === 'transactionId') {
      transactions = await Payment.find({ _id: query });
    } else {
      return res.status(400).json({ error: 'Invalid search type' });
    }

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No matching transactions found' });
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error searching transactions:', error);
    res.status(500).json({ error: 'Failed to search transactions' });
  }
});



  

 app.listen(port, () => console.log(`server is running on: ${port}`));