import { Exclude, Expose, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './address.entity';
import Posts from 'src/post/post.entity';

@Entity()
class Users {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id: number;

  @Column('varchar', { nullable: true })
  @Expose()
  public name: string;

  @Column('text', { nullable: true })
  public content: string;

  @Column({ nullable: true })
  @Transform((value) => {
    if (value !== null) {
      return value;
    }
  })
  public category: string;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column()
  @Exclude()
  public password: string;

  @CreateDateColumn()
  public Date: Date;

  @OneToOne(() => Address, (address) => address, {
    eager: true,
    cascade: true,
  })
  @Expose()
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Posts, (post: Posts) => post.author)
  public posts: Posts[];
}

export default Users;
