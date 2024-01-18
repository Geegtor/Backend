import {
  closeTypeOrmConnection,
  createTypeOrmConnection,
} from '../../helpers/typeOrmConnection';
import request from 'supertest';
import app from '../../app/App';

beforeAll(async () => {
  await createTypeOrmConnection();
});
afterAll(async () => {
  await closeTypeOrmConnection();
});

const token = ''
describe('Creating playlist', () => {
  it('Should create new playlist', async () => {
    const res = await request(app)
      .post('/api/v1/admin/playlist')
      .set('authorization', 'Bearer ' + token)
      .field('title', 'Workout')
      .field('description', 'Music for workout')
      // .field('tracks[0]', 2)
      .attach('cover', `${__dirname}/cover.png`)
      .set('Content-Type', 'multipart/form-data')
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ msg: 'Playlist has been saved'});
  });

  it('Should fail because playlist name not specified', async () => {
    const res = await request(app)
      .post('/api/v1/admin/playlist')
      .set('authorization', 'Bearer ' + token)
      .field('title', '')
      .field('description', 'Music for workout')
      // .field('tracks', [2])
      .attach('cover', `${__dirname}/cover.png`)
      .set('Content-Type', 'multipart/form-data')
    expect(res.statusCode).toBe(400);
    expect(res.body?.errors?.length).toBeGreaterThan(0);
  });

  it('Should fail because description not specified', async () => {
    const res = await request(app)
      .post('/api/v1/admin/playlist')
      .set('authorization', 'Bearer ' + token)
      .field('title', 'Workout')
      .field('description', '')
      // .field('tracks', [2])
      .attach('cover', `${__dirname}/cover.png`)
      .set('Content-Type', 'multipart/form-data')
    expect(res.statusCode).toBe(400);
    expect(res.body?.errors?.length).toBeGreaterThan(0);
  });

  it('Should fail because file type is incorrect', async () => {
    const res = await request(app)
      .post('/api/v1/admin/playlist')
      .set('authorization', 'Bearer ' + token)
      .field('title', 'Workout')
      .field('description', 'Wwww')
      // .field('tracks', [2])
      .attach('cover', `${__dirname}/cover.txt`)
      .set('Content-Type', 'multipart/form-data')
    expect(res.statusCode).toBe(400);
  });
});
