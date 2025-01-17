import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/users.entity';

@Injectable()
export class Users23Service {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByMatriculationId(matriculationId: string) {
    const user = await this.usersRepository.findOne({
      where: { matriculationId },
    });
    if (!user) {
      throw new HttpException(
        'User with this matriculation ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findOneByStaffId(staffId: string) {
    const user = await this.usersRepository.findOne({ where: { staffId } });
    if (!user) {
      throw new HttpException(
        'User with this staff ID does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async create(userData: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  // Add the updateUser method
  async updateUser(id: number, updateData: Partial<Users>) {
    const user = await this.findOne(id);
    Object.assign(user, updateData); // Merge the existing user data with the new data
    return await this.usersRepository.save(user);
  }
}
