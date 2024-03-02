/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS file for styling

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios('http://localhost:5000/api/customers');
      setData(result.data);
    };
    fetchData();
  }, []);

  // Sort data by date
  const sortByDate = () => {
    setData([...data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))]);
    setSortBy('date');
  };

  // Sort data by time
  const sortByTime = () => {
    setData([...data.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return timeA - timeB;
    })]);
    setSortBy('time');
  };

  // Filter data based on search term
  const filteredData = data.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data before paginating
  const sortedData = sortBy === 'date' ? data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) :
                    sortBy === 'time' ? data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) :
                    data;

  // Calculate indexes for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Customer Data</h1>
      <input
        type="text"
        placeholder="Search by name or location"
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="button-container">
        <button className="sort-button" onClick={sortByDate}>Sort by Date</button>
        <button className="sort-button" onClick={sortByTime}>Sort by Time</button>
      </div>
      <table className="center-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((customer, index) => (
            <tr key={index}>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <Pagination
          recordsPerPage={recordsPerPage}
          totalRecords={sortedData.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
}

const Pagination = ({ recordsPerPage, totalRecords, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRecords / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <button onClick={() => paginate(number)} className='page-link'>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default App;
