import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      setSuccess('Registered successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: '0 20px' }}>
      <div className="card">
        <h2 style={{ marginBottom: 24, color: '#6366f1' }}>Register</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Register
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14, color: '#94a3b8' }}>
          Already have an account? <Link to="/login" style={{ color: '#6366f1' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}