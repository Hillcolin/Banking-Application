import React, { useEffect, useState } from 'react';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Making API call to /api/hello');
    fetch('http://localhost:8080/')
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
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default App;