import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type JwtPayload = { sub: string; role: string };

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
    const header = req.headers['authorization'];
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    console.log('Token recibido:', token);
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    console.log('Token verificado:', jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const role = (req as any).user?.role;
    if (role !== 'admin') return res.status(403).json({ error: 'Permisos insuficientes' });
    next();
}