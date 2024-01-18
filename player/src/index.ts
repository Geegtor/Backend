import {config} from 'dotenv';
import app from './app/App';
import {createTypeOrmConnection} from './helpers/typeOrmConnection';

config();

const appPort = process.env.EXPRESS_PORT;

app.listen(appPort, async () => {
  console.log(`Listening on port ${appPort}`);
  createTypeOrmConnection()
    .then(() => console.log('Database connection established...'))
    .catch(error => {
      console.error(error.message);
    });
});
