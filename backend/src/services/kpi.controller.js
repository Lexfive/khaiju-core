import * as service from '../services/kpi.service.js';

export const getAll = async (req, res, next) => {
  const data = await service.getKpis(req.user.id);
  res.json(data);
};