const DRONE_SERVICE_URL = process.env.DRONE_SERVICE_URL || 'http://127.0.0.1:5001';

export async function armDrone() {
  const res = await fetch(`${DRONE_SERVICE_URL}/command/arm`, { method: 'POST' });
  return res.json();
}

export async function takeoff(altitude?: number) {
  const url = altitude
    ? `${DRONE_SERVICE_URL}/command/takeoff?altitude=${altitude}`
    : `${DRONE_SERVICE_URL}/command/takeoff`;
  const res = await fetch(url, { method: 'POST' });
  return res.json();
}

export async function landDrone() {
  const res = await fetch(`${DRONE_SERVICE_URL}/command/land`, { method: 'POST' });
  return res.json();
}

export async function getDronePosition() {
  const res = await fetch(`${DRONE_SERVICE_URL}/telemetry/position`);
  return res.json();
}
