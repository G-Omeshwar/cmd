import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4">ERP CRM Portal</h2>
          <p className="text-center text-muted mb-4">Sign in to your account</p>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <hr />
          <p className="text-muted small mb-2"><strong>Test Credentials:</strong></p>
          <p className="text-muted small mb-1"><strong>Admin:</strong> admin@company.com / admin123</p>
          <p className="text-muted small mb-1"><strong>Sales:</strong> sales@company.com / sales123</p>
          <p className="text-muted small mb-1"><strong>Warehouse:</strong> warehouse@company.com / warehouse123</p>
          <p className="text-muted small"><strong>Accounts:</strong> accounts@company.com / accounts123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
