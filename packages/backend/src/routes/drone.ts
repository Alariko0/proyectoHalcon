import { Router } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { armDrone, takeoff, landDrone, getDronePosition } from '../services/droneService';

const router = Router();

router.use(authenticate);
router.use(requireRole(['admin', 'operador']));

router.post('/arm', async (req: AuthRequest, res) => {
  try {
    const result = await armDrone();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/takeoff', async (req: AuthRequest, res) => {
  const { altitude } = req.body;
  try {
    const result = await takeoff(altitude);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/land', async (req: AuthRequest, res) => {
  try {
    const result = await landDrone();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/position', async (req: AuthRequest, res) => {
  try {
    const result = await getDronePosition();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;












