import React, { useState } from 'react';
import { Mail, Lock, Loader2, Code, Shield } from 'lucide-react';
import './index.css';

const Login = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate login network request
    setTimeout(() => {
      setIsLoading(false);
      navigateTo('landing');
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="grid-bg"></div>
      
      <div className="login-split">
        {/* Left Side - Hero / Tagline */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="logo-container mb-8 cursor-pointer" onClick={() => navigateTo('landing')}>
              <img src="/logo.png" alt="DevGuard AI Logo" className="logo-icon" />
              <span>DevGuard <span className="gradient-text">AI</span></span>
            </div>
            
            <h1 className="login-title mb-4">
              Secure Your Code.<br/>
              <span className="gradient-text">Smarter Reviews.</span>
            </h1>
            <p className="login-subtitle mb-8">
              Join thousands of developers catching bugs and security vulnerabilities before they hit production.
            </p>
            
            <div className="abstract-graphic">
               <div className="graphic-circle graphic-circle-1"></div>
               <div className="graphic-circle graphic-circle-2"></div>
               <Shield size={80} className="graphic-icon icon-shield" />
               <Code size={40} className="graphic-icon icon-code" />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-card glass">
            <h2 className="mb-2 text-center" style={{ fontSize: '2rem' }}>Welcome Back</h2>
            <p className="text-center text-secondary mb-8">Sign in to your DevGuard AI account</p>
            
            <form onSubmit={handleLogin}>
              {error && <div className="error-message mb-4">{error}</div>}
              
              <div className="input-group mb-4">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="input-group mb-4">
                <div className="flex justify-between items-center w-full">
                  <label>Password</label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="checkbox-group mb-8">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              
              <button type="submit" className="btn btn-primary w-full mb-6" disabled={isLoading} style={{ height: '48px', width: '100%' }}>
                {isLoading ? <Loader2 className="spinner" size={20} /> : "Log In"}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="social-login">
              <button className="btn btn-social mb-3" style={{ padding: '0.8rem', borderRadius: '12px' }}>
                <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', marginRight: '8px' }} />
                Continue with Google
              </button>
              <button className="btn btn-social mb-6" style={{ padding: '0.8rem', borderRadius: '12px' }}>
                 <Code size={18} style={{ marginRight: '8px' }}/> Continue with GitHub
              </button>
            </div>

            <p className="text-center text-secondary">
              Don't have an account? <a href="#" className="gradient-text font-bold" style={{ textDecoration: 'none' }}>Sign up</a>
            </p>
          </div>

          <div className="login-footer">
            <a href="#">Terms</a>
            <span>•</span>
            <a href="#">Privacy</a>
            <span>•</span>
            <a href="#"><Code size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
