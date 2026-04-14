import * as service from '../services/report.service.js';

export const getAll = async (req, res, next) => {
  try {
    const data = await service.getReports(req.user.id);
    res.json(data);
  } catch (error) {
    console.error('[Report Controller Error]:', error);
    next(error);
  }
};
