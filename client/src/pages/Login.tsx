import { useState, FormEvent, ChangeEvent } from "react";
import Auth from '../utils/auth';
import { login } from "../api/authAPI";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login(loginData);
      Auth.login(data.token);
    } catch (err) {
      console.error('Failed to login', err);
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container fade-in">
      <div className="card">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="text-center mb-6">Welcome Back</h1>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              autoComplete="username"
              aria-label="Username"
              className={error ? 'error' : ''}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              autoComplete="current-password"
              aria-label="Password"
              className={error ? 'error' : ''}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="error-message slide-in">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`btn-primary w-full ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
