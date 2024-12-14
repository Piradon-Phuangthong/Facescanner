import React from 'react';

const Dashboard = ({ onLogout }) => {
  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <p>You have successfully logged in.</p>
      <button onClick={onLogout} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
