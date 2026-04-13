import * as service from '../services/transaction.service.js';

export const getAll = async (req, res, next) => {
  const result = await service.getTransactions(req.user.id, req.query);
  res.json(result);
};

export const create = async (req, res, next) => {
  const data = await service.createTransaction(req.user.id, req.body);
  res.status(201).json(data);
};

export const update = async (req, res, next) => {
  const data = await service.updateTransaction(req.user.id, req.params.id, req.body);
  res.json(data);
};

export const deleteOne = async (req, res, next) => {
  const data = await service.deleteTransaction(req.user.id, req.params.id);
  res.json(data);
};