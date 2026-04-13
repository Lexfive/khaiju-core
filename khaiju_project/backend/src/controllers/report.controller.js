import * as service from '../services/report.service.js';
export const getAll = async (req, res) => res.json(await service.getReports(req.user.id));