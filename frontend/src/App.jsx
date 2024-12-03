import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Payments from './Pages/Payments';
import Transactions from './Pages/Transactions';


axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path='/' element={<Payments />} />
    <Route path='/transaction' element={<Transactions/>}/>
    </Routes>
  );
}

export default App;
