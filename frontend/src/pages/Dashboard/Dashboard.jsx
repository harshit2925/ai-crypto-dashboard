import React, { useState } from 'react';
import OverviewTab from './tabs/OverviewTab';
import CurrentPricesTab from './tabs/CurrentPricesTab';
import PortfolioTab from './tabs/PortfolioTab';
import TopMoversTab from './tabs/TopMoversTab';
import TransactionsTab from './tabs/TransactionsTab';
import FloatingChatBubble from '../../components/FloatingChatBubble';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleNavigate = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🚀 AI Crypto Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="header-tabs">
          <button
            className={`header-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleNavigate('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`header-tab ${activeTab === 'prices' ? 'active' : ''}`}
            onClick={() => handleNavigate('prices')}
          >
            💹 Current Prices
          </button>
          <button
            className={`header-tab ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => handleNavigate('portfolio')}
          >
            💰 Portfolio
          </button>
          <button
            className={`header-tab ${activeTab === 'movers' ? 'active' : ''}`}
            onClick={() => handleNavigate('movers')}
          >
            🏆 Top Movers
          </button>
          <button
            className={`header-tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => handleNavigate('transactions')}
          >
            📋 Transactions
          </button>
        </div>

        {/* Logout Button */}
        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Tab Content */}
      <main className="dashboard-content">
        {activeTab === 'overview' && <OverviewTab onNavigate={handleNavigate} />}
        {activeTab === 'prices' && <CurrentPricesTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'movers' && <TopMoversTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
      </main>

      {/* Floating Chat Bubble */}
      <FloatingChatBubble />
    </div>
  );
}