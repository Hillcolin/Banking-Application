import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import LandingPage from './components/LandingPage';
import './App.css';

const App = () => {
  const [message, setMessage] = useState('');
  useEffect(() => {
    console.log('Making API call to /api/hello');
    fetch('/api')
      .then(response => {
        console.log('Response:', response);
        return response.text();
      })
      .then(data => {
        console.log('Data:', data);
        setMessage(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;