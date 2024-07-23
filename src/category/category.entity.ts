import Posts from 'src/post/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => Posts, (post: Posts) => post.categories)
  public posts: Posts[];
}

export default Category;
