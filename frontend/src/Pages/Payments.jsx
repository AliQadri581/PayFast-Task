
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Payments = () => {
  const [formData, setFormData] = useState({
    amount: '',
    email: '',
    address: '',
    bankId: '',
    bankAccountNumber: '',
    bankName: '',
    cnic: '',
    mobileNumber: '',
    currency: 'USD',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.amount && formData.currency) {
      fetchConversionRate();
    }
  }, [formData.amount, formData.currency]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchConversionRate = async () => {
    try {
      const { currency, amount } = formData;
      if (!amount) return;

      const response = await axios.post('/api/convert', {
        fromCurrency: currency,
        amount: amount,
      });

      setConvertedAmount(response.data.convertedAmount);
      setError('');
    } catch (error) {
      setError('Error fetching exchange rate');
    }
  };

  const handleBankNameChange = async (e) => {
    const selectedBank = e.target.value;
    setFormData({ ...formData, bankName: selectedBank });
    if (selectedBank) {
      try {
        const response = await axios.get(`/api/banks/${selectedBank}`);
        setFormData((prevState) => ({ ...prevState, bankId: response.data.bankId }));
      } catch {
        setError('Error fetching bank ID');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!convertedAmount) {
      setError('Conversion failed, please try again.');
      return;
    }

    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    if (!cnicRegex.test(formData.cnic)) {
      setError('Invalid CNIC format');
      return;
    }

    const paymentData = { ...formData, amount: convertedAmount };

    try {
      const response = await axios.post('/api/payments', paymentData);
      setMessage(response.data.message);
      setError('');
      setFormData({
        amount: '',
        email: '',
        address: '',
        bankId: '',
        bankAccountNumber: '',
        bankName: '',
        cnic: '',
        mobileNumber: '',
        currency: 'USD',
      });
      setConvertedAmount('');
      navigate('/transaction');
    } catch (error) {
      setError('Error saving payment: ' + (error.response?.data?.details || error.message));
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Payment Form</h1>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control border border-black"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control border border-black"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bankName" className="form-label">Bank Name</label>
          <select
            className="form-select border border-black"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleBankNameChange}
            required
          >
            <option value="">Select a Bank</option>
            <option value="Habib Bank">Habib Bank</option>
            <option value="Meezan Bank">Meezan Bank</option>
            <option value="JS Bank">JS Bank</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="bankAccountNumber" className="form-label">Bank Account Number</label>
          <input
            type="text"
            className="form-control border border-black"
            id="bankAccountNumber"
            name="bankAccountNumber"
            value={formData.bankAccountNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="currency" className="form-label">Currency</label>
          <select
            className="form-select border border-black"
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
          >
            <option value="USD">USD</option>
            <option value="PKR">PKR</option>
            <option value="AED">AED</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control border border-black"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          {convertedAmount && (
            <div className="mt-2">
              Converted Amount in PKR: <strong>{convertedAmount}</strong>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="cnic" className="form-label">CNIC</label>
          <input
            type="text"
            className="form-control border border-black"
            id="cnic"
            name="cnic"
            value={formData.cnic}
            onChange={handleChange}
            required
            placeholder="xxxxx-xxxxxxx-x"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
          <input
            type="text"
            className="form-control border border-black"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
        <Link to="/transaction" className="btn btn-secondary ms-3">Transactions</Link>
      </form>
    </div>
  );
};

export default Payments;
