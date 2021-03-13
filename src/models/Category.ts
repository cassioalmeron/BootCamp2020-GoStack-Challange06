import { Column, Entity } from 'typeorm';
import ModelBase from './ModelBase';

@Entity('categories')
class Category extends ModelBase {
  @Column()
  title: string;
}

export default Category;
