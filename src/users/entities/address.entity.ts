import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import Users from './users.entity';
import { Expose } from 'class-transformer';

@Entity()
class Address {
  @Expose()
  @PrimaryGeneratedColumn()
  public id: number;

  @Expose()
  @Column()
  public country: string;

  @Expose()
  @Column()
  public city: string;

  @Expose()
  @Column()
  public street: string;

  // @OneToOne(() => Users, (user: Users) => user.address)
  // public user: Users;
}

export default Address;
