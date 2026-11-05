import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Sistema Vigilancia</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          {role === 'admin' && (
            <Link to="/sites" className="block p-2 hover:bg-gray-700 rounded">Sitios</Link>
          )}
          <Link to="/alerts" className="block p-2 hover:bg-gray-700 rounded">Alertas</Link>
        </nav>
        <div className="absolute bottom-4">
          <p className="text-sm">{user?.email}</p>
          <button onClick={handleSignOut} className="text-sm text-gray-400 hover:text-white">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
