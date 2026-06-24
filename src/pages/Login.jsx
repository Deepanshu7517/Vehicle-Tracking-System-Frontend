import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login({ onLogin }) {
  const navigate        = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: data.role }));
      onLogin(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1117',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#1a1d27', border: '1px solid #2d3148',
        borderRadius: 16, padding: '40px 48px', width: 380,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🚛</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0' }}>TruckTrack</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Fleet Monitoring System</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              style={{
                width: '100%', padding: '10px 14px',
                background: '#0f1117', border: '1px solid #2d3148',
                borderRadius: 8, color: '#e2e8f0', fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#64748b', marginBottom: 6, display: 'block' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 14px',
                background: '#0f1117', border: '1px solid #2d3148',
                borderRadius: 8, color: '#e2e8f0', fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#3d0f0f', border: '1px solid #7f1d1d',
              borderRadius: 8, padding: '10px 14px',
              color: '#ef4444', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px', borderRadius: 8, border: 'none',
              background: loading ? '#1a3a6e' : '#4f8ef7',
              color: '#fff', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}