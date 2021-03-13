import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const balance = await repository.getBalance();

  const transactions = await repository.find();

  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const service = new CreateTransactionService();
  const transaction = await service.execute(request.body);
  return response.status(201).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const service = new DeleteTransactionService();
  service.execute(request.params.id);
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const service = new ImportTransactionsService();
    const transactions = await service.execute(request.file.filename);
    return response.status(201).json(transactions);
  },
);

export default transactionsRouter;
