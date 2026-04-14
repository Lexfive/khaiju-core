import * as service from '../services/category.service.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await service.getCategories(req.user.id);
    res.json(data);
  } catch (error) {
    console.error('[Category Controller Error]:', error);
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = await service.createCategory(req.user.id, req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error('[Category Controller Error]:', error);
    next(error);
  }
};
