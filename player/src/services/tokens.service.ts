import {config} from 'dotenv';
import jwt from 'jsonwebtoken';
import {User} from '../entity/User';

config();

interface TokenData {
  token: string;
  expiresIn: number;
}

interface DecodedToken {
  id: number;
  role: string;
}

class JWT {
  constructor() {
    this.createToken = this.createToken.bind(this);
    this.decodeToken = this.decodeToken.bind(this);
  }

  public createToken(user: User): TokenData {
    const expiresIn = 60 * 60 * 2;
    const secret = process.env.SECRET_TOKEN || 'tsss';
    const data = {
      id: user.id,
      role: user.role,
    };

    return {
      expiresIn,
      token: jwt.sign(data, secret, {expiresIn}),
    };
  }

  public decodeToken(token): DecodedToken {
    const key = process.env.SECRET_TOKEN || 'tsss';
    const user = jwt.verify(token, key) as DecodedToken;
    return user;
  }
}

export default JWT;
