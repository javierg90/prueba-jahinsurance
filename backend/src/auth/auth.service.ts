import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const db = require('../db/models') // ajusta import según tu index de modelos

type JwtPayload = { sub: string; role: string };

const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN: number = parseInt(process.env.JWT_EXPIRES_IN!) || 60;
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'refreshsecret';
const JWT_REFRESH_EXPIRES_IN: number = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!) || 604800;

export const AuthService = {
    async validateCredentials(email: string, password: string) {
        // IMPORTANTE: ajusta según cómo exportas tus modelos: db.User o db.models.User
        const User = (db as any).User;
        const user = await User.findOne({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return null;

        return user; // devolver instancia Sequelize
    },

    signAccessToken(email: string, role: string) {
        const payload: JwtPayload = { sub: email, role };
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    },

    signRefreshToken(email: string) {
        const payload = { sub: email };
        return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
    },

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch {
            return null;
        }
    },

    verifyRefreshToken(token: string): { sub: string } | null {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET) as { sub: string };
        } catch {
            return null;
        }
    }
};
