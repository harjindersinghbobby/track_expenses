import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from '../style/AuthLayout.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <form className={styles['auth-form']} onSubmit={handleLogin}>
        <h2 className={styles['auth-title']}>Login👋</h2>

        <label className={styles['auth-label']}>
          Username
          <input
            type="text"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className={styles['auth-input']}
          />
        </label>

        <label className={styles['auth-label']}>
          Password
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className={styles['auth-input']}
          />
        </label>

        {error && <p className={styles['auth-error']}>{error}</p>}

        <button
          type="submit"
          className={styles['auth-button']}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className={styles['auth-switch']}>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
