// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

export interface TransactionDto {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: TransactionDto): Promise<Transaction> {
    const repository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await repository.getBalance();
      if (value > balance.total) throw new AppError('without enough balance!');
    }

    const categoryRepository = getRepository(Category);
    let categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      categoryExists = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryExists);
    }

    const transaction = repository.create({
      title,
      type,
      value,
      category_id: categoryExists.id,
    });
    await repository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
