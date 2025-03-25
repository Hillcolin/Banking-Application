import React, { useState } from 'react';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  const fetchMessage = async () => {
    try {
      const response = await fetch('http://localhost:18080/');
      const data = await response.text();
      setMessage(data);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button onClick={fetchMessage}>Get Message</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default App;