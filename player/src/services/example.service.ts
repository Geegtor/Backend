import {Request, Response} from 'express';
import {getRepository} from 'typeorm';
import {User} from '../entity/User';

class ExampleService {
  constructor() {
    this.get_something = this.get_something.bind(this);
  }

  async get_something(req: Request, res: Response) {
    const everything = await getRepository(User).find();
    res.json(everything);
  }
}

export default ExampleService;
