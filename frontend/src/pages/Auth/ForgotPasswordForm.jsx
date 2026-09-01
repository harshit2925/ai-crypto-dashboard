import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function ForgotPasswordForm({ onBack }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { forgotPassword, resetPassword, loading } = useAuth();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess('Reset token sent! Check your email (or copy from above)');
      setStep('token');
    } else {
      setError(result.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resetToken || !newPassword || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await resetPassword(resetToken, newPassword, confirmPassword);

    if (result.success) {
      setSuccess('✅ Password reset successful! Redirecting to login...');
      setTimeout(() => {
        onBack();
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-form forgot-password-form">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {step === 'email' && (
        <form onSubmit={handleRequestReset}>
          <h3>Reset Your Password</h3>
          <p className="form-description">
            Enter your email and we'll send you a reset token
          </p>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>

          <button
            type="button"
            className="back-link"
            onClick={onBack}
            disabled={loading}
          >
            ← Back to Login
          </button>
        </form>
      )}

      {step === 'token' && (
        <form onSubmit={handleResetPassword}>
          <h3>Reset Your Password</h3>
          <p className="form-description">
            Enter the reset token from your email and your new password
          </p>

          <div className="form-group">
            <label htmlFor="resetToken">Reset Token</label>
            <textarea
              id="resetToken"
              placeholder="Paste the reset token from your email"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              disabled={loading}
              rows="3"
            />
            <small>You can copy the token that was displayed above</small>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <button
            type="button"
            className="back-link"
            onClick={onBack}
            disabled={loading}
          >
            ← Back to Login
          </button>
        </form>
      )}
    </div>
  );
}