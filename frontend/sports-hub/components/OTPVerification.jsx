import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../src/AuthContext';
import { getApiUrl, API_ENDPOINTS } from '../src/config/api';
import './css/otp-verification.css';

export default function OTPVerification() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const inputRefs = useRef([]);

  const type = searchParams.get('type'); // 'register' or 'reset'
  const email = searchParams.get('email');

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValue = value.slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < pastedValue.length && i < 6; i++) {
        newOtp[i] = pastedValue[i];
      }
      setOtp(newOtp);
      
      // Focus on the next empty input or the last one
      const nextIndex = Math.min(pastedValue.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    } else {
      // Handle single character input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    
    // Clear errors when user starts typing
    if (errors) {
      setErrors('');
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (!otpString || otpString.length !== 6) {
      setErrors('Please enter a valid 6-digit OTP');
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let successMessage = '';
      let redirectPath = '';

      if (type === 'login') {
        endpoint = getApiUrl(API_ENDPOINTS.VERIFY_OTP);
        successMessage = 'Login successful! Redirecting...';
        redirectPath = '/';
      } else if (type === 'reset') {
        endpoint = getApiUrl('/api/auth/verify-reset-token');
        successMessage = 'Token verified! You can now reset your password.';
        redirectPath = `/reset-password?email=${email}&token=${otpString}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp: otpString
        })
      });

      const result = await res.json();

      if (!res.ok) {
        setErrors(result.message || 'Verification failed');
        toast.error(result.message || 'Verification failed');
      } else {
        if (type === 'login') {
          // Store token and user data for login
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('email', email); // Store email for backward compatibility
          // Update auth context
          login(result.user, result.token);
        }
        toast.success(successMessage);
        setTimeout(() => navigate(redirectPath), 2000);
      }
    } catch (err) {
      setErrors('Network error. Try again.');
      toast.error('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      let endpoint = '';
      let body = {};

      if (type === 'login') {
        endpoint = getApiUrl('/api/auth/resend-otp');
        body = { email };
      } else if (type === 'reset') {
        endpoint = getApiUrl('/api/auth/forgot-password');
        body = { email };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || 'Failed to resend OTP');
      } else {
        toast.success('New OTP sent to your email!');
        setTimeLeft(600); // Reset timer to 10 minutes
        setCanResend(false);
      }
    } catch (err) {
      toast.error('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleBackToRegister = () => {
    navigate('/register');
  };

  if (!email || !type) {
    return (
      <div className="otp-container">
        <div className="otp-card">
          <div className="otp-icon">⚠️</div>
          <h2>Invalid Verification Link</h2>
          <p>The verification link is invalid or has expired.</p>
          <button onClick={handleBackToLogin} className="otp-btn">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-icon">
          {type === 'login' ? '🔑' : '🔐'}
        </div>
        
        <h2>
          {type === 'login' ? 'Login Verification' : 'Password Reset Verification'}
        </h2>
        
        <p className="otp-description">
          {type === 'login' 
            ? 'We\'ve sent a 6-digit verification code to your email address.'
            : 'We\'ve sent a 6-digit reset code to your email address.'
          }
        </p>
        
        <div className="email-display">
          <strong>{email}</strong>
        </div>

        <form onSubmit={handleOTPVerification} className="otp-form">
          <div className="form-group">
            <label className="otp-label">Enter Verification Code</label>
            <div className="otp-inputs-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`otp-digit-input ${errors ? 'error' : ''}`}
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
              ))}
            </div>
            {errors && <span className="error-text">{errors}</span>}
          </div>

          <button 
            type="submit" 
            className="otp-btn verify-btn" 
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>
        </form>

        <div className="timer-section">
          {timeLeft > 0 ? (
            <p className="timer">
              Code expires in: <span className="timer-countdown">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <p className="timer expired">Code has expired</p>
          )}
        </div>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button 
            onClick={handleResendOTP} 
            className="resend-btn"
            disabled={!canResend || loading}
          >
            {canResend ? 'Resend Code' : 'Resend Code'}
          </button>
        </div>

        <div className="back-section">
          <button onClick={handleBackToLogin} className="back-btn">
            ← Back to Login
          </button>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
} 