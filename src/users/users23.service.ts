import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Users from './entities/users.entity';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class Users23Service {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getByEmail(email: string) {
    console.log(email);

    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async findOne(id: number) {
    try {
      console.log(id);

      const user = await this.usersRepository.findOne({ where: { id } });
      return user;
    } catch (error) {
      throw new HttpException('id not found', HttpStatus.NOT_FOUND);
    }
  }

  async create(userData: CreateUserDto) {
    try {
      const doesUserExist = await this.usersRepository.findOneBy({
        email: userData?.email,
      });

      if (doesUserExist) {
        throw new ConflictException('user already exist');
      }
      const newUser = this.usersRepository.create(userData);
      await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.error('Error in Users23Service.create:', error);
      throw new HttpException(
        'Failed to create user. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
