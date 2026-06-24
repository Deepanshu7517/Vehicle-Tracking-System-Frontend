import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, createUser, updateUser, deleteUser } from '../api';
// ── Constants ─────────────────────────────────────────────────────────────────
const ROLES       = ['Admin', 'Manager', 'Operator', 'Viewer'];
const DEPARTMENTS = ['Operations', 'Engineering', 'Safety', 'Management', 'IT'];

const EMPTY_FORM = {
  name: '', username: '', email: '',
  employeeId: '', role: 'Operator',
  department: 'Operations', password: '',
};

// ── Reusable input style ──────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '9px 12px',
  background: '#0f1117', border: '1px solid #2d3148',
  borderRadius: 8, color: '#e2e8f0', fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: 11, color: '#64748b',
  marginBottom: 5, display: 'block',
  textTransform: 'uppercase', letterSpacing: 0.5,
};

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ── Role badge ────────────────────────────────────────────────────────────────
const ROLE_COLORS = {
  Admin:    { bg: '#1a3a6e', color: '#4f8ef7', border: '#2d5aa0' },
  Manager:  { bg: '#3d2a0a', color: '#f59e0b', border: '#78450f' },
  Operator: { bg: '#0f3d1f', color: '#22c55e', border: '#166534' },
  Viewer:   { bg: '#1e1e2e', color: '#94a3b8', border: '#2d3148' },
};

function RoleBadge({ role }) {
  const c = ROLE_COLORS[role] ?? ROLE_COLORS.Viewer;
  return (
    <span style={{
      fontSize: 10, padding: '2px 9px', borderRadius: 10,
      fontWeight: 600, background: c.bg, color: c.color,
      border: `1px solid ${c.border}`,
    }}>
      {role}
    </span>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function UserModal({ mode, initial, onClose, onSave, loading, error }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);
  const isEdit = mode === 'edit';

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function handleSubmit(e) {
    e.preventDefault();
    // On edit, don't send password if left blank
    const payload = { ...form };
    if (isEdit && !payload.password) delete payload.password;
    onSave(payload);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: 16,
    }}>
      <div style={{
        background: '#1a1d27', border: '1px solid #2d3148',
        borderRadius: 16, width: '100%', maxWidth: 560,
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid #2d3148',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>
            {isEdit ? 'Edit User' : 'Add New User'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#64748b',
            fontSize: 20, cursor: 'pointer', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Name + Username */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Full Name">
              <input style={inputStyle} value={form.name}
                onChange={e => set('name', e.target.value)} required placeholder="John Doe" />
            </Field>
            <Field label="Username">
              <input style={inputStyle} value={form.username}
                onChange={e => set('username', e.target.value)} required placeholder="johndoe" />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email">
            <input style={inputStyle} type="email" value={form.email}
              onChange={e => set('email', e.target.value)} required placeholder="john@example.com" />
          </Field>

          {/* Employee ID + Role */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Employee ID">
              <input style={inputStyle} value={form.employeeId}
                onChange={e => set('employeeId', e.target.value)} required placeholder="EMP001" />
            </Field>
            <Field label="Role">
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>

          {/* Department */}
          <Field label="Department">
            <select style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.department} onChange={e => set('department', e.target.value)}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>

          {/* Password */}
          <Field label={isEdit ? 'New Password (leave blank to keep current)' : 'Password'}>
            <input style={inputStyle} type="password" value={form.password}
              onChange={e => set('password', e.target.value)}
              required={!isEdit} placeholder={isEdit ? '••••••••' : 'Min 8 characters'} />
          </Field>

          {/* Error */}
          {error && (
            <div style={{
              background: '#3d0f0f', border: '1px solid #7f1d1d',
              borderRadius: 8, padding: '10px 14px',
              color: '#ef4444', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} style={{
              padding: '9px 20px', borderRadius: 8,
              border: '1px solid #2d3148', background: 'none',
              color: '#94a3b8', fontSize: 13, cursor: 'pointer',
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              padding: '9px 20px', borderRadius: 8, border: 'none',
              background: loading ? '#1a3a6e' : '#4f8ef7',
              color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirm modal ──────────────────────────────────────────────────────
function DeleteModal({ user, onClose, onConfirm, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: 16,
    }}>
      <div style={{
        background: '#1a1d27', border: '1px solid #7f1d1d',
        borderRadius: 16, padding: 28, width: '100%', maxWidth: 400,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>
          Delete User
        </h2>
        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24, lineHeight: 1.6 }}>
          Are you sure you want to delete <strong style={{ color: '#e2e8f0' }}>{user.name}</strong>?
          <br />This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onClose} style={{
            padding: '9px 24px', borderRadius: 8,
            border: '1px solid #2d3148', background: 'none',
            color: '#94a3b8', fontSize: 13, cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            padding: '9px 24px', borderRadius: 8, border: 'none',
            background: loading ? '#7f1d1d' : '#ef4444',
            color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function UserManagement({ currentUser }) {
  const qc = useQueryClient();

  const [modal, setModal]   = useState(null); // null | { mode: 'add' } | { mode: 'edit', user }
  const [delUser, setDelUser] = useState(null);
  const [mutErr, setMutErr]   = useState('');
  const [search, setSearch]   = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn:  getAllUsers,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createMut = useMutation({
    mutationFn: createUser,
    onSuccess:  () => { qc.invalidateQueries(['users']); setModal(null); setMutErr(''); },
    onError:    (e) => setMutErr(e.response?.data?.message ?? 'Failed to create user'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess:  () => { qc.invalidateQueries(['users']); setModal(null); setMutErr(''); },
    onError:    (e) => setMutErr(e.response?.data?.message ?? 'Failed to update user'),
  });

  const deleteMut = useMutation({
    mutationFn: deleteUser,
    onSuccess:  () => { qc.invalidateQueries(['users']); setDelUser(null); },
    onError:    (e) => console.error('Delete failed:', e.message),
  });

  // ── Filtered users ─────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.employeeId?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q)
    );
  });

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 28,
        flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
            User Management
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            {users.length} user{users.length !== 1 ? 's' : ''} registered
            {!isAdmin && ' · View only — Admin access required to make changes'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setMutErr(''); setModal({ mode: 'add' }); }}
            style={{
              padding: '9px 18px', borderRadius: 9,
              border: '1px solid #2d5aa0', background: '#1a3a6e',
              color: '#4f8ef7', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            + Add User
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20, maxWidth: 360 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, ID, department..."
          style={{ ...inputStyle, paddingLeft: 14 }}
        />
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        {ROLES.map(role => {
          const count = users.filter(u => u.role === role).length;
          const c     = ROLE_COLORS[role] ?? ROLE_COLORS.Viewer;
          return (
            <div key={role} style={{
              background: '#1a1d27', border: `1px solid ${c.border}`,
              borderRadius: 10, padding: '14px 16px',
            }}>
              <div style={{ fontSize: 11, color: c.color, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                {role}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#e2e8f0' }}>{count}</div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{
        background: '#1a1d27', border: '1px solid #2d3148',
        borderRadius: 12, overflow: 'hidden',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isAdmin
            ? '1fr 1fr 1.4fr 0.8fr 1fr 0.9fr 0.8fr'
            : '1fr 1fr 1.4fr 0.8fr 1fr 0.9fr',
          padding: '10px 20px',
          background: '#141720', borderBottom: '1px solid #2d3148',
          gap: 12,
        }}>
          {['Name', 'Username', 'Email', 'Emp ID', 'Department', 'Role',
            ...(isAdmin ? ['Actions'] : [])
          ].map(h => (
            <div key={h} style={{
              fontSize: 10, color: '#64748b', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: 0.8,
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            {search ? 'No users match your search' : 'No users found'}
          </div>
        ) : (
          filtered.map((u, idx) => (
            <div
              key={u._id}
              style={{
                display: 'grid',
                gridTemplateColumns: isAdmin
                  ? '1fr 1fr 1.4fr 0.8fr 1fr 0.9fr 0.8fr'
                  : '1fr 1fr 1.4fr 0.8fr 1fr 0.9fr',
                padding: '14px 20px', gap: 12,
                alignItems: 'center',
                borderBottom: idx < filtered.length - 1 ? '1px solid #1e2235' : 'none',
                background: idx % 2 === 0 ? 'transparent' : '#161922',
              }}
            >
              {/* Name */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{u.name}</div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{u.email}</div>
              </div>

              {/* Username */}
              <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
                @{u.username}
              </div>

              {/* Email */}
              <div style={{
                fontSize: 12, color: '#64748b',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {u.email}
              </div>

              {/* Employee ID */}
              <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>
                {u.employeeId}
              </div>

              {/* Department */}
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{u.department}</div>

              {/* Role */}
              <div><RoleBadge role={u.role} /></div>

              {/* Actions — admin only */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => { setMutErr(''); setModal({ mode: 'edit', user: u }); }}
                    style={{
                      padding: '4px 12px', borderRadius: 6,
                      border: '1px solid #2d3148', background: 'none',
                      color: '#94a3b8', fontSize: 11, cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDelUser(u)}
                    disabled={u._id === currentUser?._id}
                    style={{
                      padding: '4px 12px', borderRadius: 6,
                      border: '1px solid #7f1d1d', background: 'none',
                      color: '#ef4444', fontSize: 11,
                      cursor: u._id === currentUser?._id ? 'not-allowed' : 'pointer',
                      opacity: u._id === currentUser?._id ? 0.4 : 1,
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {modal?.mode === 'add' && (
        <UserModal
          mode="add"
          initial={EMPTY_FORM}
          onClose={() => setModal(null)}
          onSave={(data) => createMut.mutate(data)}
          loading={createMut.isPending}
          error={mutErr}
        />
      )}

      {modal?.mode === 'edit' && (
        <UserModal
          mode="edit"
          initial={{ ...modal.user, password: '' }}
          onClose={() => setModal(null)}
          onSave={(data) => updateMut.mutate({ id: modal.user._id, data })}
          loading={updateMut.isPending}
          error={mutErr}
        />
      )}

      {delUser && (
        <DeleteModal
          user={delUser}
          onClose={() => setDelUser(null)}
          onConfirm={() => deleteMut.mutate(delUser._id)}
          loading={deleteMut.isPending}
        />
      )}
    </div>
  );
}