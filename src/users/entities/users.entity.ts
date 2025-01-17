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
  // @Exclude()
  @Expose()
  public id: number;

  @Column('varchar')
  @Expose()
  public name: string;

  @Column('text', { nullable: true })
  @Expose()
  public content: string;

  @Column({ nullable: true })
  @Transform((value) => {
    if (value !== null) {
      return value;
    }
  })
  @Exclude()
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
  @JoinColumn()
  @Expose()
  public address: Address;

  @OneToMany(() => Posts, (post: Posts) => post.author, { eager: true })
  @Exclude()
  public posts: Posts[];
}

export default Users;
