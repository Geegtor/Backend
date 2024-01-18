import request from 'supertest';
import {closeTypeOrmConnection, createTypeOrmConnection} from '../../helpers/typeOrmConnection';
import app from '../../app/App';

beforeAll(async () => {
  await createTypeOrmConnection();
});
afterAll(async () => {
  await closeTypeOrmConnection();
});

describe('Creating genres', () => {
  it('Should create a new genre', async () => {
    const res = await request(app).post('/api/v1/genre').send({name: 'Rap', color: 'white'});

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name');
  });

  it('Should fail because genre name not specified', async () => {
    const res = await request(app).post('/api/v1/genre').send({name: '', color: 'white'});

    expect(res.statusCode).toBe(400);
    expect(res.body?.errors?.length).toBeGreaterThan(0);
  });

  it('Should fail because the genre already exists', async () => {
    const res = await request(app).post('/api/v1/genre').send({name: 'Rap', color: 'white'});

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({msg: 'This genre is already exists.'});
  });
});

describe('Editing genre', () => {
  it('Should change genre name', async () => {
    const res = await request(app).put('/api/v1/genre/1').send({name: 'Hip-Hop', color: 'white'});

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Hip-Hop');
  });
});

describe('Deleting genre', () => {
  it('Should delete genre', async () => {
    const res = await request(app).delete('/api/v1/genre/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({msg: 'Genre successfully deleted'});
  });

  it('Should return error becouse the genre does not exist', async () => {
    const res = await request(app).delete('/api/v1/genre/5');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({msg: "This genre doesn't exist"});
  });
});
