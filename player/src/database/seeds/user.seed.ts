import {Connection} from 'typeorm';
import {Factory, Seeder} from 'typeorm-seeding';
import crypto from 'crypto';
import {User, UserRole} from '../../entity/User';

class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          firstName: 'userqwerty',
          lastName: 'userqwerty',
          userName: 'userqwerty',
          email: 'user@qwerty.com',
          phone: '+71234567890',
          password: crypto.createHash('sha256').update('userqwerty').digest('base64'),
          role: UserRole.USER,
        },
        {
          firstName: 'userqwerty1',
          lastName: 'userqwerty1',
          userName: 'userqwerty1',
          email: 'user1@qwerty.com',
          phone: '+71334567890',
          password: crypto.createHash('sha256').update('userqwerty1').digest('base64'),
          role: UserRole.SUPER_ADMIN,
        },
      ])
      .execute();
  }
}

export default CreateUsers;
