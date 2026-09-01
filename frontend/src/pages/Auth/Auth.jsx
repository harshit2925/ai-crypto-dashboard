import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import './Auth.css';

export default function Auth() {
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>AI Crypto Dashboard</h1>
          <p>Intelligent cryptocurrency portfolio management</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            Login
          </button>
          <button
            className={`tab ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => setAuthMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-content">
          {authMode === 'login' && (
            <LoginForm onForgotPassword={() => setAuthMode('forgotPassword')} />
          )}
          {authMode === 'signup' && <SignupForm />}
          {authMode === 'forgotPassword' && (
            <ForgotPasswordForm onBack={() => setAuthMode('login')} />
          )}
        </div>

        <div className="auth-footer">
          <p>© 2024 AI Crypto Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}