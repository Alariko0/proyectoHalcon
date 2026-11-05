# services/drone-control/main.py
from fastapi import FastAPI, HTTPException
from mavsdk import System
import asyncio
import uvicorn
from contextlib import asynccontextmanager

drone = System()
connected = False
TELEMETRY_TIMEOUT = 2.0  # segundos

@asynccontextmanager
async def lifespan(app: FastAPI):
    global connected
    print("🔌 Iniciando tarea de conexión con el dron...")
    asyncio.create_task(connect_to_drone())
    yield
    print("🛑 Apagando servicio")

async def connect_to_drone():
    global connected
    while True:
        try:
            print("⏳ Intentando conectar a udpin://0.0.0.0:14550...")
            await drone.connect(system_address="udpin://0.0.0.0:14550")
            print("✅ Conexión establecida con el dron (SITL o real)")
            connected = True
            # Mantener la conexión viva monitoreando heartbeats
            async for state in drone.core.connection_state():
                if not state.is_connected:
                    print("⚠️ Conexión perdida, reconectando...")
                    connected = False
                    break
        except Exception as e:
            print(f"❌ Error de conexión: {e}. Reintentando en 3 segundos...")
            connected = False
            await asyncio.sleep(3)

app = FastAPI(lifespan=lifespan, title="Drone Control Service")

async def get_telemetry(telemetry_generator, timeout=TELEMETRY_TIMEOUT):
    """Obtiene el primer valor de un generador de telemetría con timeout."""
    try:
        return await asyncio.wait_for(telemetry_generator.__anext__(), timeout)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Timeout esperando telemetría del dron")
    except StopAsyncIteration:
        raise HTTPException(status_code=500, detail="El dron no está enviando datos")

@app.get("/")
async def root():
    return {"service": "Drone Control", "connected": connected}

@app.get("/telemetry/state")
async def get_state():
    if not connected:
        raise HTTPException(status_code=503, detail="Dron no conectado")
    try:
        armed = await get_telemetry(drone.telemetry.armed())
        mode = await get_telemetry(drone.telemetry.flight_mode())
        pos = await get_telemetry(drone.telemetry.position())
        return {
            "armed": armed,
            "flight_mode": str(mode),
            "altitude": pos.relative_altitude_m
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/telemetry/position")
async def get_position():
    if not connected:
        raise HTTPException(status_code=503, detail="Dron no conectado")
    try:
        pos = await get_telemetry(drone.telemetry.position())
        return {
            "lat": pos.latitude_deg,
            "lon": pos.longitude_deg,
            "alt": pos.relative_altitude_m,
            "abs_alt": pos.absolute_altitude_m
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/command/arm")
async def arm():
    if not connected:
        raise HTTPException(status_code=503, detail="Dron no conectado")
    try:
        await drone.action.arm()
        await asyncio.sleep(1)
        return {"status": "success", "message": "Motores armados"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/command/takeoff")
async def takeoff(altitude: float = 2.5):
    if not connected:
        raise HTTPException(status_code=503, detail="Dron no conectado")
    try:
        # Verificar altura actual con timeout
        pos = await get_telemetry(drone.telemetry.position())
        if pos.relative_altitude_m > 0.5:
            return {"status": "info", "message": "El dron ya está en el aire"}

        await drone.action.set_takeoff_altitude(altitude)
        await drone.action.takeoff()
        return {"status": "success", "message": f"Despegando a {altitude} metros"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/command/land")
async def land():
    if not connected:
        raise HTTPException(status_code=503, detail="Dron no conectado")
    try:
        await drone.action.land()
        return {"status": "success", "message": "Aterrizando"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/command/rtl")
async def return_to_launch():
    if not connected:
        raise HTTPException(status_code=503, detail="Dron no conectado")
    try:
        await drone.action.return_to_launch()
        return {"status": "success", "message": "Regresando a casa"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5001)