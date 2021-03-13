import Readlines from 'n-readlines';
import path from 'path';
import Transaction from '../models/Transaction';
import CreateTransactionService, {
  TransactionDto,
} from './CreateTransactionService';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const items = await this.readAndParseFile(filename);

    const transactions: Transaction[] = [];

    const createTransactionService = new CreateTransactionService();

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // eslint-disable-next-line no-await-in-loop
      const transaction = await createTransactionService.execute(item);
      transactions.push(transaction);
    }

    return transactions;
  }

  private readAndParseFile(filename: string): TransactionDto[] {
    const items: TransactionDto[] = [];

    const lines = this.readFileLines(filename);

    lines.forEach(line => {
      const [title, type, value, category] = line.split(', ');

      const item = {
        title,
        type: type as 'income' | 'outcome',
        value: Number(value),
        category,
      };

      items.push(item);
    });

    return items;
  }

  private readFileLines(filename: string): string[] {
    const filenameFullPath = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      filename,
    );

    const liner = new Readlines(filenameFullPath);

    let lines = [];
    let next;
    while ((next = liner.next())) {
      lines.push(next.toString('utf8').replace('\r', ''));
    }

    lines = lines.splice(1);

    return lines;
  }
}

export default ImportTransactionsService;
