import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import OverviewTab from './tabs/OverviewTab';
import CurrentPricesTab from './tabs/CurrentPricesTab';
import PortfolioTab from './tabs/PortfolioTab';
import TopMoversTab from './tabs/TopMoversTab';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();

  const handleNavigate = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="dashboard-container">
      {/* Header with Tabs */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>AI Crypto Dashboard</h1>
        </div>

        {/* Tabs in Header */}
        <div className="header-tabs">
          <button
            className={`header-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`header-tab ${activeTab === 'prices' ? 'active' : ''}`}
            onClick={() => setActiveTab('prices')}
          >
            💹 Current Prices
          </button>
          <button
            className={`header-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            💰 Portfolio
          </button>
          <button
            className={`header-tab ${activeTab === 'movers' ? 'active' : ''}`}
            onClick={() => setActiveTab('movers')}
          >
            🚀 Top Movers
          </button>
        </div>

        <div className="header-right">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'overview' && <OverviewTab onNavigate={handleNavigate} />}
        {activeTab === 'prices' && <CurrentPricesTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'movers' && <TopMoversTab />}
      </div>
    </div>
  );
}