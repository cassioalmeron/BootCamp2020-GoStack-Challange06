import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Category from './Category';
import ModelBase from './ModelBase';

@Entity('transactions')
class Transaction extends ModelBase {
  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @Column()
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

export default Transaction;
