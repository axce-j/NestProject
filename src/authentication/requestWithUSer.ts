import { Request } from 'express';
import { Users } from 'src/users/entities/users.entity';

export interface RequestWithUser extends Request {
  user: Users;
}
