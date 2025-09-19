import { Request, Response } from 'express';
import { AuthService } from './auth.service';
const db = require('../db/models')

export const AuthController = {
    async login(req: Request, res: Response) {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ error: 'Email y password son requeridos' });

        const user = await AuthService.validateCredentials(email, password);
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

        const token = AuthService.signAccessToken(user.email, user.role);
        const refreshToken = AuthService.signRefreshToken(user.email);

        // Se puede guardar refreshToken en DB si se quiere invalidación explícita (opcional)
        return res.json({
            data: { token, refreshToken },
            user: { id: user.id, email: user.email, role: user.role }
        });
    },

    async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body || {};
        if (!refreshToken) return res.status(400).json({ error: 'refreshToken requerido' });

        const decoded = AuthService.verifyRefreshToken(refreshToken);
        if (!decoded) return res.status(401).json({ error: 'refreshToken inválido' });

        // opcional: verificar que el usuario aún existe y/o que el refreshToken está en whitelist
        const User = (db as any).User;
        const user = await User.findOne({ where: { email: decoded.sub } });
        if (!user) return res.status(401).json({ error: 'refreshToken inválido' });

        const token = AuthService.signAccessToken(user.email, user.role);
        return res.json({ data: { token } });
    },

    async me(req: Request, res: Response) {
        const authUser = (req as any).user; // seteado por verifyJWT
        // Se puede enriquecer con datos reales de DB si se necesita
        return res.json({ data: { email: authUser?.sub, role: authUser?.role } });
    },

    async logout(_req: Request, res: Response) {
        // En JWT puro no hay sesión que “borrar”; si se guarda refresh en DB, se marca como revocado.
        return res.status(204).send();
    }
};
