import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const income = await this.sumByType('income');
    const outcome = await this.sumByType('outcome');
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  private async sumByType(type: 'income' | 'outcome'): Promise<number> {
    const transactions = await this.find({ where: { type } });
    const sum =
      transactions.length > 0
        ? Number(
            transactions
              .map(transaction => transaction.value)
              .reduce((total, value) => Number(total) + Number(value)),
          )
        : 0;

    return sum;
  }
}

export default TransactionsRepository;
