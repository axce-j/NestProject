import { Expose } from 'class-transformer';
import Category from 'src/category/category.entity';
import Users from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Posts {
  @Expose()
  @PrimaryGeneratedColumn()
  public id: number;

  @Expose()
  @Column()
  public title: string;
  @Expose()
  @Column()
  public content: string;
  // @Expose()
  // @Column({ nullable: true })
  // public category?: string;
  @Expose()
  @ManyToOne(() => Users, (author: Users) => author.posts)
  public author: Users;
  @Expose()
  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];
}

export default Posts;
