import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks);
    } catch {
      setError('Failed to fetch tasks');
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.post('/tasks', form);
      setForm({ title: '', description: '' });
      setSuccess('Task created!');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await api.put(`/tasks/${editTask.id}`, {
        title: editTask.title,
        description: editTask.description,
        status: editTask.status,
      });
      setEditTask(null);
      setSuccess('Task updated!');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setSuccess('Task deleted!');
      fetchTasks();
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const statusColor = { pending: '#f59e0b', 'in-progress': '#6366f1', completed: '#22c55e' };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ color: '#6366f1' }}>Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>
            Welcome, {user?.name} · <span style={{ color: '#6366f1' }}>{user?.role}</span>
          </p>
        </div>
        <button className="btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Create Task */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Create New Task</h3>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', marginBottom: 12, minHeight: 80 }}
          />
          <button type="submit" className="btn-primary">Add Task</button>
        </form>
      </div>

      {/* Edit Task Modal */}
      {editTask && (
        <div className="card" style={{ border: '1px solid #6366f1' }}>
          <h3 style={{ marginBottom: 16, color: '#6366f1' }}>Edit Task</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={editTask.title}
              onChange={e => setEditTask({ ...editTask, title: e.target.value })}
              required
            />
            <textarea
              value={editTask.description || ''}
              onChange={e => setEditTask({ ...editTask, description: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0', marginBottom: 12, minHeight: 80 }}
            />
            <select
              value={editTask.status}
              onChange={e => setEditTask({ ...editTask, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn-success">Save</button>
              <button type="button" className="btn-danger" onClick={() => setEditTask(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <h3 style={{ marginBottom: 16 }}>
        {user?.role === 'admin' ? 'All Tasks' : 'My Tasks'} ({tasks.length})
      </h3>
      {tasks.length === 0 && <p style={{ color: '#94a3b8' }}>No tasks yet. Create one above!</p>}
      {tasks.map(task => (
        <div key={task.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ marginBottom: 4 }}>{task.title}</h4>
              {task.description && <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>{task.description}</p>}
              {user?.role === 'admin' && task.owner && (
                <p style={{ fontSize: 12, color: '#6366f1' }}>Owner: {task.owner}</p>
              )}
              <span style={{
                fontSize: 12, padding: '2px 10px', borderRadius: 20,
                background: statusColor[task.status] + '22',
                color: statusColor[task.status]
              }}>
                {task.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" onClick={() => setEditTask(task)}>Edit</button>
              <button className="btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}