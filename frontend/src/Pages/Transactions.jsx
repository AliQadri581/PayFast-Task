
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('mobileNumber'); 
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions');
  
        const sortedTransactions = response.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
  
        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) {
      setFilteredTransactions(transactions);
      setCurrentPage(1);
      return;
    }

    try {
      const response = await axios.get(
        `/api/transactions/search/${searchType}/${searchQuery}`
      );
      setFilteredTransactions(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching transactions:', error);
      setFilteredTransactions([]);
      setCurrentPage(1);
    }
  };

  const displayedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const NextPage = () => setCurrentPage(currentPage + 1);
  const PreviousPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Transactions</h1>

  
      <div className="mb-3">
        <input
          type="text"
          className="form-control border border-black"
          placeholder={`Search by ${searchType === 'mobileNumber' ? 'Mobile Number' : 'Transaction ID'}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="mt-2">
          <label className="me-2">
            <input
              type="radio"
              name="searchType"
              value="mobileNumber"
              checked={searchType === 'mobileNumber'}
              onChange={() => setSearchType('mobileNumber')}
            />
            Mobile Number
          </label>
          <label className="ms-3">
            <input
              type="radio"
              name="searchType"
              value="transactionId"
              checked={searchType === 'transactionId'}
              onChange={() => setSearchType('transactionId')}
            />
            Transaction ID
          </label>
        </div>
        <button className="btn btn-primary mt-2" onClick={handleSearch}>
          Search
        </button>
      </div>

     
      <div className="mt-4">
        {displayedTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          displayedTransactions.map((transaction) => (
            <div key={transaction._id} className="card mb-3">
              <div className="card-body border border-black">
                <h5 className="card-title">Transaction ID: {transaction._id}</h5>
                <p className="card-text">Mobile: {transaction.mobileNumber}</p>
                <p className="card-text">Amount: {transaction.amount}</p>
                <p className="card-text">CNIC: {transaction.cnic}</p>
              </div>
            </div>
          ))
        )}
      </div>

  
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-primary"
          onClick={PreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          className="btn btn-primary"
          onClick={NextPage}
          disabled={currentPage * transactionsPerPage >= filteredTransactions.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transactions;
