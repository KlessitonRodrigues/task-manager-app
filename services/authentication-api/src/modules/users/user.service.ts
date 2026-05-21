import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [
    { id: 1, username: 'john', password: 'changeme' },
    { id: 2, username: 'maria', password: 'guess' },
  ];

  async findOne(username: string): Promise<any> {
    return this.users.find(user => user.username === username);
  }
}
