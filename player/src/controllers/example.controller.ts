import {IRouter} from 'express';
import {authMiddleware} from '../helpers/validation';
import ExampleService from '../services/example.service';

class ExampleController {
  private exampleService: ExampleService;

  constructor(private router: IRouter) {
    this.exampleService = new ExampleService();
    this.routes();
  }

  public routes() {
    this.router.route('/something').get(authMiddleware, this.exampleService.get_something);
  }
}

export default ExampleController;
