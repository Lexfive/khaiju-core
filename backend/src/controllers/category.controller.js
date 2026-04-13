import * as service from '../services/category.service.js';

export const getAll = async (req, res) => res.json(await service.getCategories(req.user.id));
export const create = async (req, res) => res.status(201).json(await service.createCategory(req.user.id, req.body));