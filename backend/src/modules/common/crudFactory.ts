import { Model, ModelStatic } from 'sequelize';
import { Request, Response } from 'express';
import { buildListOptions } from '../../utils/query';


export function crudController<T extends Model>(ModelCls: ModelStatic<T>,
    opts?: {
        listAllowedFilters?: string[];
        defaultInclude?: any[];
        beforeCreate?(payload: any): Promise<any> | any;
        beforeUpdate?(payload: any): Promise<any> | any;
    }) {
    const list = async (req: Request, res: Response) => {
        const options = buildListOptions(req.query, opts?.listAllowedFilters);
        if (opts?.defaultInclude) (options as any).include = opts.defaultInclude;
        const { rows, count } = await ModelCls.findAndCountAll(options);
        return res.json({ data: rows, meta: { count } });
    };


    const getById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ error: 'ID requerido' });
        const options: any = {};
        if (opts?.defaultInclude) options.include = opts.defaultInclude;
        const row = await ModelCls.findByPk(id, options);
        if (!row) return res.status(404).json({ error: 'No encontrado' });
        return res.json({ data: row });
    };


    const create = async (req: Request, res: Response) => {
        const payload = opts?.beforeCreate ? await opts.beforeCreate(req.body) : req.body;
        const row = await ModelCls.create(payload as any);
        return res.status(201).json({ data: row });
    };


    const update = async (req: Request, res: Response) => {
        const id = req.params.id;
        const existing = await ModelCls.findByPk(id);
        if (!existing) return res.status(404).json({ error: 'No encontrado' });
        const payload = opts?.beforeUpdate ? await opts.beforeUpdate(req.body) : req.body;
        await existing.update(payload as any);
        return res.json({ data: existing });
    };


    const remove = async (req: Request, res: Response) => {
        const id = req.params.id;
        const deleted = await ModelCls.destroy({ where: { id } as any });
        if (!deleted) return res.status(404).json({ error: 'No encontrado' });
        return res.status(204).send();
    };


    return { list, getById, create, update, remove };
}