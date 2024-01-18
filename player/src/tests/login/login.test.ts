import request from 'supertest';
import {closeTypeOrmConnection, createTypeOrmConnection} from '../../helpers/typeOrmConnection';
import app from '../../app/App';

beforeAll(async () => {
  await createTypeOrmConnection();
});
afterAll(async () => {
  await closeTypeOrmConnection();
});

describe("Login with invalida cred's", () => {
  it('validation error expected:', async () => {
    const res = await request(app).post('/api/v1/login').send({
      login: '',
      password: '',
    });

    expect(res?.statusCode).toBe(400);
    expect(res.body?.errors?.length).toBeGreaterThan(0);
  });
});

describe("Login with unexisting  cred's", () => {
  it('message of wrong email:', async () => {
    const res = await request(app).post('/api/v1/login').send({
      login: 'awesome@nesss.com',
      password: '1111111111',
    });

    expect(res?.statusCode).toBe(401);
    expect(res.body?.error).toBe('Login is incorrect');
  });
});

describe("Login with valid user  cred's", () => {
  it('adding of a new user:', async () => {
    const res = await request(app).post('/api/v1/register').send({
      firstName: 'tester',
      lastName: 'tester',
      userName: 'tester',
      email: 'tester@tester.com',
      phone: '+1111111111',
      password: 'testtest',
      passwordConfirmation: 'testtest',
    });

    expect(res?.statusCode).toBe(201);
  });

  it("logging with a new user cred's:", async () => {
    const res = await request(app).post('/api/v1/login').send({
      login: 'tester@tester.com',
      password: 'testtest',
    });

    expect(res?.statusCode).toBe(200);
    expect(res.body?.token).toBeDefined();
  });
});

describe('Logout', () => {
  it('set-cookie as empty:', async () => {
    const res = await request(app).delete('/api/v1/logout');
    expect(res?.header['set-cookie']).toEqual(['Authorization=; Path=/']);
  });
});

describe('Password faild change requests: ', () => {
  it('returns validation input errors ', async () => {
    const res = await request(app).post('/api/v1/reset-password').send({
      login: '',
    });
    expect(res?.body?.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBeTruthy();
  });

  it('returns login errors ', async () => {
    const res = await request(app).post('/api/v1/reset-password').send({
      login: '+1111111112',
    });
    expect(res?.body?.error).toBeDefined();
    expect(res.body.error).toBe('Login is incorrect');
  });
});

describe('Password reset requests: ', () => {
  let testData = {};
  it('get restoration code', async () => {
    const res = await request(app).post('/api/v1/reset-password').send({
      login: '+1111111111',
    });
    testData = res.body.verificationCode;

    expect(res.body).toBeDefined();
    expect(res.statusCode).toBe(200);
  });

  it('change the password', async () => {
    const res = await request(app)
      .post('/api/v1/change-password/')
      .send({
        verificationCode: `${testData}`,
        password: 'newpassword',
        passwordConfirmation: 'newpassword',
      });
    expect(res.body).toBeDefined();
    expect(res.statusCode).toBe(200);
  });

  it('get too soon error', async () => {
    const res = await request(app).post('/api/v1/reset-password').send({
      login: '+1111111111',
    });
    expect(res.body).toBeDefined();
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Too soon to request password restoration');
  });

  it('logging with a new user password:', async () => {
    const res = await request(app).post('/api/v1/login').send({
      login: 'tester@tester.com',
      password: 'newpassword',
    });

    expect(res?.statusCode).toBe(200);
    expect(res.body?.token).toBeDefined();
  });

  it('adding amother user:', async () => {
    const res = await request(app).post('/api/v1/register').send({
      firstName: 'tester',
      lastName: 'tester',
      userName: 'tester',
      email: 'test@tester.com',
      phone: '+222222222',
      password: 'testtest',
      passwordConfirmation: 'testtest',
    });

    expect(res?.statusCode).toBe(201);
  });

  it('get password change via email', async () => {
    const res = await request(app).post('/api/v1/reset-password').send({
      login: 'test@tester.com',
    });
    testData = res.body.verificationCode;
    expect(res.body).toBeDefined();
    expect(res.statusCode).toBe(200);
  });

  it('change the password via link', async () => {
    const res = await request(app).post(`/api/v1/change-password/${testData}`).send({
      password: 'newpassword2',
      passwordConfirmation: 'newpassword2',
    });
    expect(res.body).toBeDefined();
    expect(res.statusCode).toBe(200);
  });

  it('logging with a new user password:', async () => {
    const res = await request(app).post('/api/v1/login').send({
      login: 'test@tester.com',
      password: 'newpassword2',
    });

    expect(res?.statusCode).toBe(200);
    expect(res.body?.token).toBeDefined();
  });
});
