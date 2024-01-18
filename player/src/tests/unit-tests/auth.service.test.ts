import {Request} from 'express';
import * as typeorm from 'typeorm';
import {AuthService} from '../../services/auth.service';
import {MailService} from '../../services/mail.service';

jest.mock('typeorm', () => {
  const original = jest.requireActual('typeorm');
  return {
    ...original,
    getRepository: jest.fn(),
  };
});

describe('Auth Service', () => {
  let authService;
  beforeEach(() => {
    authService = new AuthService();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Service initialization', () => {
    it('should be correctly imported and defined', () => {
      expect(authService).not.toBeUndefined();
      expect(authService).toHaveProperty('mailService');
      expect(authService).toHaveProperty('phoneService');
      expect(authService).toHaveProperty('register');
      expect(authService).toHaveProperty('verificateByEmail');
      expect(authService).toHaveProperty('verificateByPhone');
    });
  });
  describe('.register', () => {
    describe('Given E-mail already exists', () => {
      let mockFindOne;
      let mockSave;
      let mockHashPassword;

      const mockRequest = {
        body: {
          firstName: 'Joe',
          lastName: 'Doe',
          userName: 'Joe',
          email: 'joe@gmail.net',
          phone: '+358424455',
          password: 'secret',
        },
      } as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      beforeEach(() => {
        const original = jest.requireActual('typeorm');
        mockFindOne = jest.fn().mockResolvedValueOnce(true);
        mockSave = jest.fn();
        jest.spyOn(typeorm, 'getRepository').mockImplementation(() => ({
          ...original,
          findOne: mockFindOne,
          save: mockSave,
        }));
        mockHashPassword = jest.spyOn(AuthService.prototype, 'hashPassword');
        authService.register(mockRequest, mockResponse);
      });
      afterEach(() => {
        jest.clearAllMocks();
      });
      it('should return valid response to user', () => {
        expect(mockResponse.status).toHaveBeenNthCalledWith(1, 400);
        expect(mockResponse.json).toHaveBeenNthCalledWith(1, {
          exists: 'E-mail is already registered',
        });
      });
      it('should call .findOne with {email} once', () => {
        expect(mockFindOne).toHaveBeenNthCalledWith(1, {
          email: mockRequest.body.email,
        });
      });
      it('should not call .save and .hashPassword', () => {
        expect(mockSave).not.toBeCalled();
        expect(mockHashPassword).not.toBeCalled();
      });
    });
    describe('Given phone already exists', () => {
      let mockFindOne, mockSave, mockHashPassword;
      const mockRequest = {
        body: {
          firstName: 'Joe',
          lastName: 'Doe',
          userName: 'Joe',
          email: 'joe@gmail.net',
          phone: '+358424455',
          password: 'secret',
        },
      } as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      beforeEach(() => {
        const original = jest.requireActual('typeorm');
        mockFindOne = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
        mockSave = jest.fn();
        jest.spyOn(typeorm, 'getRepository').mockImplementation(() => ({
          ...original,
          findOne: mockFindOne,
          save: mockSave,
        }));
        mockHashPassword = jest.spyOn(AuthService.prototype, 'hashPassword');
        authService.register(mockRequest, mockResponse);
      });
      afterEach(() => jest.clearAllMocks());
      it('should return valid response to user', () => {
        expect(mockResponse.status).toHaveBeenNthCalledWith(1, 400);
        expect(mockResponse.json).toHaveBeenNthCalledWith(1, {
          exists: 'Phone is already registered',
        });
      });
      it('should call .findOne twice', () => {
        expect(mockFindOne).toHaveBeenCalledTimes(2);
      });
      it('should not call .save and .hashPassword', () => {
        expect(mockSave).not.toBeCalled();
        expect(mockHashPassword).not.toBeCalled();
      });
    });
    describe('Brand new User', () => {
      let mockFindOne;
      let mockSave;
      let mockHashPassword;
      const mockRequest = {
        body: {
          firstName: 'Joe',
          lastName: 'Doe',
          userName: 'Joe',
          email: 'joe@gmail.net',
          phone: '+358424455',
          password: 'secret',
        },
      } as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      beforeEach(() => {
        const original = jest.requireActual('typeorm');
        mockFindOne = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(false);
        mockSave = jest.fn().mockResolvedValueOnce(mockRequest.body);
        jest.spyOn(typeorm, 'getRepository').mockImplementation(() => ({
          ...original,
          findOne: mockFindOne,
          save: mockSave,
        }));
        mockHashPassword = jest
          .spyOn(AuthService.prototype, 'hashPassword')
          .mockImplementation(() => 'secret');
        authService.register(mockRequest, mockResponse);
      });
      afterEach(() => jest.clearAllMocks());
      it('should return valid response to user', () => {
        expect(mockResponse.status).toHaveBeenNthCalledWith(1, 201);
        expect(mockResponse.json).toHaveBeenNthCalledWith(1, mockRequest.body);
      });
      it('should call .findOne twice', () => {
        expect(mockFindOne).toHaveBeenCalledTimes(2);
      });
      it('should call .save and .hashPassword', () => {
        expect(mockSave).toHaveBeenNthCalledWith(1, mockRequest.body);
        expect(mockHashPassword).toBeCalledTimes(1);
      });
    });
  });
  describe('.verificateByEmail', () => {
    describe('Given email is already registered', () => {
      let mockFindOne;
      let mockSendVerificationLink;
      const mockRequest = {
        body: {
          email: 'joe@gmail.net',
        },
      } as Request;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      beforeEach(() => {
        const original = jest.requireActual('typeorm');
        mockFindOne = jest.fn().mockResolvedValueOnce(true);
        mockSendVerificationLink = jest.spyOn(MailService.prototype, 'sendVerificationLink');
        jest.spyOn(typeorm, 'getRepository').mockImplementation(() => ({
          ...original,
          findOne: mockFindOne,
        }));
        authService.verificateByEmail(mockRequest, mockResponse);
      });
      afterEach(() => {
        jest.clearAllMocks();
      });
      it('should return valid response to user', () => {
        expect(mockResponse.status).toHaveBeenNthCalledWith(1, 400);
        expect(mockResponse.json).toHaveBeenNthCalledWith(1, {
          exists: 'E-mail is already registered',
        });
      });
      it('should call .findOne with {email} once', () => {
        expect(mockFindOne).toHaveBeenNthCalledWith(1, {
          email: mockRequest.body.email,
        });
      });
      it('should not call .sendVerificationLink', () => {
        expect(mockSendVerificationLink).not.toHaveBeenCalled();
      });
    });
    describe('Given email is NOT registered', () => {
      describe('Link was sent successfully - SMTP service OK!', () => {
        let mockFindOne;
        let mockSendVerificationLink;
        const mockRequest = {
          body: {
            email: 'joe@gmail.net',
          },
        } as Request;
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as any;
        beforeEach(() => {
          const original = jest.requireActual('typeorm');
          mockFindOne = jest.fn().mockResolvedValueOnce(false);
          mockSendVerificationLink = jest
            .spyOn(MailService.prototype, 'sendVerificationLink')
            .mockResolvedValue(true);
          jest.spyOn(typeorm, 'getRepository').mockImplementation(() => ({
            ...original,
            findOne: mockFindOne,
          }));
          authService.verificateByEmail(mockRequest, mockResponse);
        });
        afterEach(() => {
          jest.clearAllMocks();
        });
        it('should return valid response to user', () => {
          expect(mockResponse.status).toHaveBeenNthCalledWith(1, 200);
          expect(mockResponse.json).toHaveBeenNthCalledWith(1, {
            msg: `Verification link has been sent to ${mockRequest.body.email}. Please follow it to continue`,
          });
        });
        it('should call .findOne with {email} once', () => {
          expect(mockFindOne).toHaveBeenNthCalledWith(1, {
            email: mockRequest.body.email,
          });
        });
        it('should call .sendVerificationLink', () => {
          expect(mockSendVerificationLink).toHaveBeenNthCalledWith(1, mockRequest.body.email);
        });
      });
      describe('Link sending failed - SMTP service NOT OK!', () => {
        let mockFindOne;
        let mockSendVerificationLink;

        const mockRequest = {
          body: {
            email: 'joe@gmail.net',
          },
        } as Request;
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as any;
        beforeEach(() => {
          const original = jest.requireActual('typeorm');
          mockFindOne = jest.fn().mockResolvedValueOnce(false);
          mockSendVerificationLink = jest
            .spyOn(MailService.prototype, 'sendVerificationLink')
            .mockResolvedValue(false);
          jest.spyOn(typeorm, 'getRepository').mockImplementation(() => ({
            ...original,
            findOne: mockFindOne,
          }));
          authService.verificateByEmail(mockRequest, mockResponse);
        });
        afterEach(() => {
          jest.clearAllMocks();
        });
        it('should return valid response to user', () => {
          expect(mockResponse.status).toHaveBeenNthCalledWith(1, 503);
          expect(mockResponse.json).toHaveBeenNthCalledWith(1, {
            msg: 'Failed to send verification link',
          });
        });
        it('should call .findOne with {email} once', () => {
          expect(mockFindOne).toHaveBeenNthCalledWith(1, {
            email: mockRequest.body.email,
          });
        });
        it('should call .sendVerificationLink', () => {
          expect(mockSendVerificationLink).toHaveBeenNthCalledWith(1, mockRequest.body.email);
        });
      });
    });
  });
  describe('.verificateByPhone', () => {});
  describe('.hasPassword', () => {});
});
