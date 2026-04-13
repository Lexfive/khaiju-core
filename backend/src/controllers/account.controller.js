import * as service from '../services/account.service.js';
export const getAll = async (req, res) => res.json(await service.getAccounts(req.user.id));
export const create = async (req, res) => res.status(201).json(await service.createAccount(req.user.id, req.body));