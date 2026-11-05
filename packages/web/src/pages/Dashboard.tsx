import { useAuth } from '../contexts/AuthContext';
import DroneControlPanel from '../components/DroneControlPanel';

export default function Dashboard() {
  const { role, loading } = useAuth();

  // 🔍 AÑADE ESTA LÍNEA PARA DEPURAR
  console.log('Dashboard - role:', role, 'loading:', loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Bienvenido</h2>
          <p>Rol: <span className="font-medium">{role || 'Sin rol asignado'}</span></p>
        </div>

        {(role === 'operador' || role === 'admin') && (
          <div className="lg:col-span-2">
            <DroneControlPanel />
          </div>
        )}
      </div>
    </div>
  );
}