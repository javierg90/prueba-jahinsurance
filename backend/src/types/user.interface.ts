export interface UserAttrs {
    id: number;
    email: string;
    password_hash: string;
    role: 'admin' | 'user';
    created_at?: Date;
}