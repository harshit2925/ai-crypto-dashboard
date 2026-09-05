import React, { useState } from 'react';
import OverviewTab from './tabs/OverviewTab';
import CurrentPricesTab from './tabs/CurrentPricesTab';
import PortfolioTab from './tabs/PortfolioTab';
import TopMoversTab from './tabs/TopMoversTab';
// import FloatingChatBubble from '../components/FloatingChatBubble';
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
          <h1 className="site-name">🚀 AI Crypto Dashboard</h1>
        </div>

        {/* Tabs */}
        <nav className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleNavigate('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'prices' ? 'active' : ''}`}
            onClick={() => handleNavigate('prices')}
          >
            💹 Current Prices
          </button>
          <button
            className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => handleNavigate('portfolio')}
          >
            💰 Portfolio
          </button>
          <button
            className={`tab-btn ${activeTab === 'movers' ? 'active' : ''}`}
            onClick={() => handleNavigate('movers')}
          >
            🏆 Top Movers
          </button>
        </nav>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Tab Content */}
      <main className="tab-content">
        {activeTab === 'overview' && <OverviewTab onNavigate={handleNavigate} />}
        {activeTab === 'prices' && <CurrentPricesTab />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'movers' && <TopMoversTab />}
      </main>

      {/* Floating Chat Bubble */}
      <FloatingChatBubble />
    </div>
  );
}