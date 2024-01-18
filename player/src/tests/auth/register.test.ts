import request from 'supertest';
import {closeTypeOrmConnection, createTypeOrmConnection} from '../../helpers/typeOrmConnection';
import app from '../../app/App';

beforeAll(async () => {
  await createTypeOrmConnection();
});

afterAll(async () => {
  await closeTypeOrmConnection();
});

describe('Register a user', () => {
  it('should pass an email verification', async () => {
    const res = await request(app).post('/api/v1/email-verification').send({
      email: 'johndoe@example.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      msg: 'Verification link has been sent to johndoe@example.com. Please follow it to continue',
    });
  });

  it('should pass a phone verification', async () => {
    const res = await request(app).post('/api/v1/phone-verification').send({
      phone: '+1231232323',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toMatch(/[a-z0-9]{4}/);
  });

  it('should pass a code verification', async () => {
    const phoneVerificationRes = await request(app).post('/api/v1/phone-verification').send({
      phone: '+1231232323',
    });

    const res = await request(app).post('/api/v1/code-verification').send({
      verificationCode: phoneVerificationRes.body.msg,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({msg: 'code is verificated successfully'});
  });

  it('should create a new user', async () => {
    const res = await request(app).post('/api/v1/register').send({
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johnDoe',
      email: 'johndoe@example.com',
      phone: '+1231232323',
      password: 'test12',
      passwordConfirmation: 'test12',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('firstName');
  });

  it('should fail an email verification because such email has already been registered', async () => {
    const res = await request(app).post('/api/v1/email-verification').send({
      email: 'johndoe@example.com',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({msg: 'E-mail is already registered'});
  });

  it('should fail a phone verification because such phone has already been registered', async () => {
    const res = await request(app).post('/api/v1/phone-verification').send({
      phone: '+1231232323',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({msg: 'Phone is already registered'});
  });

  it('should fail a code verification because of an invalid code', async () => {
    const res = await request(app).post('/api/v1/code-verification').send({
      verificationCode: '0000',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({msg: 'Invalid code'});
  });

  it('should fail because a user already exists', async () => {
    const res = await request(app).post('/api/v1/register').send({
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johnDoe',
      email: 'johndoe@example.com',
      phone: '+1231232323',
      password: 'test12',
      passwordConfirmation: 'test12',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({msg: 'E-mail is already registered'});
  });
});
