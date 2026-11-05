import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function DroneControlPanel() {
  const { session } = useAuth();
  const [position, setPosition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!session?.access_token) throw new Error('No autenticado');
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
    return fetch(url, { ...options, headers });
  }, [session]);

  useEffect(() => {
    const getPosition = async () => {
      try {
        const res = await fetchWithAuth('/api/drone/position');
        const data = await res.json();
        setPosition(data);
      } catch (err) {
        console.error('Error obteniendo posición', err);
      }
    };
    getPosition();
    const interval = setInterval(getPosition, 2000);
    return () => clearInterval(interval);
  }, [fetchWithAuth]);

  const handleAction = async (endpoint: string, body?: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth(`/api/drone/${endpoint}`, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Error');
      alert(`✅ ${data.message || 'Comando ejecutado'}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">🕹️ Control del Dron</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

      <div className="mb-4 p-3 bg-gray-100 rounded">
        <p className="font-semibold">Telemetría en tiempo real</p>
        {position ? (
          <div className="text-sm">
            <p>📍 Lat: {position.lat?.toFixed(6)}</p>
            <p>📍 Lon: {position.lon?.toFixed(6)}</p>
            <p>📏 Alt: {position.alt?.toFixed(2)} m</p>
          </div>
        ) : (
          <p className="text-gray-500">Esperando datos...</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleAction('arm')}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          🔧 Armar
        </button>
        <button
          onClick={() => handleAction('takeoff', { altitude: 5.0 })}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          🚀 Despegar (5m)
        </button>
        <button
          onClick={() => handleAction('land')}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          🛬 Aterrizar
        </button>
      </div>
    </div>
  );
}