import { FindOptions, Op, Order as SequelizeOrder } from 'sequelize';

export function buildListOptions(query: any, allowed: string[] = []): FindOptions {
    const page = Math.max(parseInt(query.page ?? '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(query.pageSize ?? '10', 10), 1), 100);
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    // filtros simples por igualdad + like
    const where: any = {};
    for (const k of Object.keys(query)) {
        if (!allowed.includes(k)) continue;
        const v = query[k];
        if (typeof v === 'string' && v.includes('%')) where[k] = { [Op.like]: v };
        else where[k] = v;
    }

    // orden
    let order: SequelizeOrder = [];
    if (query.sortBy) {
        const dir = String(query.sortDir || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        order = [[query.sortBy, dir]];
    }

    return { where, limit, offset, order };
}