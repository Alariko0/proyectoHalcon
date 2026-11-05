import { Request, Response, NextFunction } from 'express';
import { supabaseAnon } from '../lib/supabase.js';

export interface AuthRequest extends Request {
  user?: any;
  role?: string;
  organizacionId?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const { data: { user }, error } = await supabaseAnon.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;

  const { data: roleData } = await supabaseAnon
    .from('roles_usuario')
    .select('rol, organizacion_id')
    .eq('usuario_id', user.id)
    .single();

  req.role = roleData?.rol || 'cliente';
  req.organizacionId = roleData?.organizacion_id;

  next();
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};











