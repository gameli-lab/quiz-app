// src/components/admin/SystemSettings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SystemSettings.css';

const SystemSettings = () => {
  const [theme, setTheme] = useState('light');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [paymentGatewayKey, setPaymentGatewayKey] = useState('');
  const [configUpdated, setConfigUpdated] = useState(false);

  useEffect(() => {
    // Fetch current system settings from backend
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/admin/settings');
      const { theme, googleAnalyticsId, paymentGatewayKey } = response.data;
      setTheme(theme);
      setGoogleAnalyticsId(googleAnalyticsId);
      setPaymentGatewayKey(paymentGatewayKey);
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const configData = { theme, googleAnalyticsId, paymentGatewayKey };
      await axios.put('/admin/settings', configData);
      setConfigUpdated(true);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const generateReport = (format) => {
    window.location.href = `/admin/reports?format=${format}`;
  };

  return (
    <div className="system-settings-container">
      <h2>System Settings</h2>

      {configUpdated && <p className="config-success">Settings successfully updated!</p>}

      <div className="settings-section">
        <h3>Platform Theme</h3>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="settings-section">
        <h3>Google Analytics Integration</h3>
        <input
          type="text"
          value={googleAnalyticsId}
          onChange={(e) => setGoogleAnalyticsId(e.target.value)}
          placeholder="Enter Google Analytics ID"
        />
      </div>

      <div className="settings-section">
        <h3>Payment Gateway Integration</h3>
        <input
          type="text"
          value={paymentGatewayKey}
          onChange={(e) => setPaymentGatewayKey(e.target.value)}
          placeholder="Enter Payment Gateway Key"
        />
      </div>

      <button className="save-btn" onClick={handleSaveSettings}>
        Save Settings
      </button>

      <div className="reports-section">
        <h3>Generate Reports</h3>
        <button onClick={() => generateReport('csv')}>Download CSV</button>
        <button onClick={() => generateReport('pdf')}>Download PDF</button>
      </div>
    </div>
  );
};

export default SystemSettings;
