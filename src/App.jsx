import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import FleetOverview  from './pages/FleetOverview';
import TruckDashboard from './pages/TruckDashboard';
import Login          from './pages/Login';
import UserManagement from './pages/UserManagement';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10000, retry: 1 } },
});

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      background: '#1a1d27', borderBottom: '1px solid #2d3148',
      padding: '0 24px', height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Left — brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ fontSize: 15, fontWeight: 700, color: '#4f8ef7', textDecoration: 'none' }}>
          🚛 TruckTrack
        </a>
        <span style={{ color: '#2d3148' }}>|</span>
        <a href="/" style={{ fontSize: 12, color: '#64748b', textDecoration: 'none' }}>
          Fleet
        </a>
        {user?.role === 'Admin' && (
          <a href="/users" style={{ fontSize: 12, color: '#64748b', textDecoration: 'none' }}>
            Users
          </a>
        )}
      </div>

      {/* Right — user info + sign out */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#1a3a6e', border: '1px solid #2d5aa0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#4f8ef7',
            }}>
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
              <span style={{ color: '#e2e8f0', fontSize: 12 }}>{user.name}</span>
              <span style={{ color: '#4f8ef7', fontSize: 10 }}>{user.role}</span>
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'none', border: '1px solid #2d3148',
              borderRadius: 6, padding: '4px 12px',
              color: '#64748b', fontSize: 12, cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
// function Navbar({ user, onLogout }) {
//   return (
//     <nav style={{
//       background: '#1a1d27', borderBottom: '1px solid #2d3148',
//       padding: '0 32px', height: 56,
//       display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//     }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//         <span style={{ fontSize: 16, fontWeight: 700, color: '#4f8ef7' }}>🚛 TruckTrack</span>
//         <span style={{ color: '#2d3148' }}>|</span>
//         <span style={{ fontSize: 13, color: '#64748b' }}>Fleet Monitoring System</span>
//       </div>
//       {user && (
//         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//           <span style={{ fontSize: 12, color: '#64748b' }}>
//             {user.name} · <span style={{ color: '#4f8ef7' }}>{user.role}</span>
//           </span>
//           <button
//             onClick={onLogout}
//             style={{
//               background: 'none', border: '1px solid #2d3148',
//               borderRadius: 6, padding: '4px 12px',
//               color: '#64748b', fontSize: 12, cursor: 'pointer',
//             }}
//           >
//             Sign out
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }

function ProtectedLayout({ children, user, onLogout }) {
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ paddingBottom: 80 }}>{children}</main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  function handleLogin(data) {
    const u = { name: data.name, email: data.email, role: data.role };
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    queryClient.clear(); // clear cached data on logout
  }

  // return (
  //   <QueryClientProvider client={queryClient}>
  //     <BrowserRouter>
  //       <Routes>
  //         <Route path="/login" element={
  //           user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
  //         } />
  //         <Route path="/" element={
  //           <ProtectedLayout user={user} onLogout={handleLogout}>
  //             <FleetOverview />
  //           </ProtectedLayout>
  //         } />
  //         <Route path="/truck/:truckId" element={
  //           <ProtectedLayout user={user} onLogout={handleLogout}>
  //             <TruckDashboard />
  //           </ProtectedLayout>
  //         } />
  //         <Route path="*" element={<Navigate to="/" replace />} />
  //       </Routes>
  //     </BrowserRouter>
  //   </QueryClientProvider>
  // );
  return (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/" element={
          <ProtectedLayout user={user} onLogout={handleLogout}>
            <FleetOverview />
          </ProtectedLayout>
        } />
        <Route path="/truck/:truckId" element={
          <ProtectedLayout user={user} onLogout={handleLogout}>
            <TruckDashboard />
          </ProtectedLayout>
        } />
        <Route path="/users" element={
          <ProtectedLayout user={user} onLogout={handleLogout}>
            <UserManagement currentUser={user} />
          </ProtectedLayout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
}