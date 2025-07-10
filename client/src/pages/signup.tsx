import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from '../style/AuthLayout.module.css';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/signup', { username, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <form className={styles['auth-form']} onSubmit={handleSignup}>
        <h2 className={styles['auth-title']}>Create an Account</h2>

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
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        <p className={styles['auth-switch']}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
