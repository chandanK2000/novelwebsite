// components/NetworkStatus.js
import React, { useState, useEffect } from 'react';
import './NetworkStatus.css';
import nointernet from '../../assets/images/nointernet.jpg';
const NetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const handleOnline = () => setIsOffline(false);
  const handleOffline = () => setIsOffline(true);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={`network-status ${isOffline ? 'active' : ''}`}>
      {isOffline && (
        <div className="network-status-message">
            <img src={nointernet} height={80} width={80} alt='internet not found'/>
          <h3>No Internet</h3>
          <p>Try:</p>
          <ul>
            <li>Checking the network cables, modem, and router</li>
            <li>Reconnecting to Wi-Fi</li>
            <li className='runnings'>Running Windows Network Diagnostics</li>
          </ul>
          <p>ERR_INTERNET_DISCONNECTED</p>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
