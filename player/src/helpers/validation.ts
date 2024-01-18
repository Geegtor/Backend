import {NextFunction, Request, Response} from 'express';
import {body, oneOf, validationResult} from 'express-validator';
import StatusCodes from 'http-status-codes';
import crypto from 'crypto';
import path from 'path';
import jwt from 'jsonwebtoken';
import {config} from 'dotenv';
import roles from './roles';
import {deleteFiles} from './trackHelpers';

config();

export const registerMiddleware = [
  body(['firstName', 'lastName', 'userName'])
    .matches(/^[^.]+([\.]?[^.]+)?$/)
    .withMessage(
      "Can contain letters, numbers, !@#$%^&*()_-=+;'?,<>[]{}|/#!~' symbols, and one dot not first or last"
    )
    .bail()
    .isLength({min: 2})
    .withMessage('Must be 2 symbols or more')
    .isLength({max: 60})
    .withMessage('Must be 60 characters or less'),
  body('phone')
    .matches(/^\+{1}\d+$/)
    .withMessage('Phone number is not valid')
    .bail()
    .isLength({min: 8})
    .withMessage('Must be 8 symbols or more')
    .isLength({max: 15})
    .withMessage('Must be 15 symbols or less'),
  body('email')
    .isEmail()
    .withMessage('E-mail address is not valid')
    .bail()
    .isLength({min: 6})
    .withMessage('Must be 6 symbols or more')
    .isLength({max: 32})
    .withMessage('Must be 32 symbols or less'),
  body('password')
    .exists({checkFalsy: true, checkNull: true})
    .withMessage('Required')
    .bail()
    .isLength({min: 6})
    .withMessage('Must be 6 characters or more')
    .isLength({max: 16})
    .withMessage('Must be 16 characters or less')
    .matches(/^[a-zA-Z0-9\!#\$%&‘\*\+-\/\\=\?\^_`{\|}~!»№;%:\?\*\(\)[\]<>,\.]+$/),
  body('passwordConfirmation').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const passwordValidationMiddleware = [
  body('password')
    .exists({checkFalsy: true, checkNull: true})
    .withMessage('Required')
    .isLength({min: 6})
    .withMessage('Must be 6 characters or more')
    .isLength({max: 16})
    .withMessage('Must be 16 characters or less')
    .matches(/^[a-zA-Z0-9\!#\$%&‘\*\+-\/\\=\?\^_`{\|}~!»№;%:\?\*\(\)[\]<>,\.]+$/),
  body('passwordConfirmation').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    next();
  },
];

export const emailVerificationMiddleware = [
  body('email')
    .isEmail()
    .withMessage('E-mail address is not valid')
    .bail()
    .isLength({min: 6})
    .withMessage('Must be 6 symbols or more')
    .isLength({max: 32})
    .withMessage('Must be 32 symbols or less'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const loginMiddleware = [
  body('login', 'Logins address is not valid')
    .exists({checkFalsy: true, checkNull: true})
    .withMessage('Required')
    .bail()
    .isLength({min: 6})
    .withMessage('Must be 6 symbols or more')
    .isLength({max: 32})
    .withMessage('Must be 32 symbols or less'),
  body('password')
    .exists({checkFalsy: true, checkNull: true})
    .withMessage('Required')
    .bail()
    .isLength({min: 6})
    .withMessage('Must be 6 characters or more')
    .isLength({max: 16})
    .withMessage('Must be 16 characters or less')
    .matches(/^[a-zA-Z0-9\!#\$%&‘\*\+-\/\\=\?\^_`{\|}~!»№;%:\?\*\(\)[\]<>,\.]+$/),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const resetMiddleware = [
  body('login').exists({checkFalsy: true, checkNull: true}).withMessage('Required').bail(),
  oneOf([
    body('login', 'E-mail address is not valid').isEmail().isLength({min: 6, max: 32}),
    body('login')
      .isLength({min: 8})
      .withMessage('Must be 8 symbols or more')
      .isLength({max: 15})
      .withMessage('Must be 15 symbols or less')
      .matches(/^\+{1}\d+$/)
      .withMessage('Phone number is not valid'),
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('base64');
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const [, token] = req.headers?.['authorization']?.split(' ');
    const key = process.env.SECRET_TOKEN || 'tsss';

    if (token == null) return res.status(StatusCodes.UNAUTHORIZED).json({error: 'Null token'});

    const decoded: any = jwt.verify(token, key);

    if (roles[decoded?.role].find(url => url == req.originalUrl)) {
      req.body.user = decoded;
      next();
    } else
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send('Access Denied: You dont have correct privilege to perform this operation');
  } catch (ex) {
    res.status(401).send('Invalid Token');
  }
};

export const validateArtistFields = [
  body('name')
    .exists({checkFalsy: true, checkNull: true})
    .withMessage('Required')
    .bail()
    .matches(/^[^.]+([\.]?[^.]+)?$/)
    .withMessage(
      "Can contain letters, numbers, !@#$%^&*()_-=+;'?,<>[]{}|/#!~' symbols, and one dot not first or last"
    )
    .bail()
    .isLength({min: 1})
    .withMessage('Must be 2 symbols or more')
    .isLength({max: 64})
    .withMessage('Must be 60 characters or less'),
  body('description')
    .exists({checkFalsy: true, checkNull: true})
    .withMessage('Required')
    .bail()
    .matches(/^[^.]+([\.]?[^.]+)?$/)
    .withMessage(
      "Can contain letters, numbers, !@#$%^&*()_-=+;'?,<>[]{}|/#!~' symbols, and one dot not first or last"
    )
    .bail()
    .isLength({min: 1})
    .withMessage('Must be 2 symbols or more')
    .isLength({max: 255})
    .withMessage('Must be 60 characters or less'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const validatePlaylistFields = [
  body('title')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .bail()
    .matches(/^[^.]+([\.]?[^.]+)?$/)
    .withMessage(
      "Can contain letters, numbers, !@#$%^&*()_-=+;'?,<>[]{}|/#!~' symbols, and one dot not first or last"
    )
    .bail()
    .isLength({ min: 1 })
    .withMessage('Must be 2 symbols or more')
    .isLength({ max: 64 })
    .withMessage('Must be 60 characters or less'),
  body('description')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .bail()
    .matches(/^[^.]+([\.]?[^.]+)?$/)
    .withMessage(
      "Can contain letters, numbers, !@#$%^&*()_-=+;'?,<>[]{}|/#!~' symbols, and one dot not first or last"
    )
    .bail()
    .isLength({ min: 1 })
    .withMessage('Must be 2 symbols or more')
    .isLength({ max: 255 })
    .withMessage('Must be 254 characters or less'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    next();
  },
];

export const phoneVerificationMiddleware = [
  body('phone')
    .matches(/^\+{1}\d+$/)
    .withMessage('Phone number is not valid')
    .bail()
    .isLength({min: 8})
    .withMessage('Must be 8 symbols or more')
    .isLength({max: 15})
    .withMessage('Must be 15 symbols or less'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const verificationCodeMiddleware = [
  body('verificationCode')
    .matches(/[a-z0-9]+/)
    .withMessage('Invalid code')
    .bail()
    .isLength({min: 4})
    .withMessage('Must be 4 symbols or more')
    .isLength({max: 5})
    .withMessage('Must be 5 symbols or less'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const genreValidationMiddleware = [
  body('name')
    .exists({checkFalsy: true, checkNull: true})
    .withMessage('Required')
    .bail()
    .matches(/[A-Za-z\-\'\s]/)
    .withMessage("Can contain only English letters, spaces and '- symbols")
    .bail()
    .isLength({min: 3})
    .withMessage('Must be 2 symbols or more')
    .isLength({max: 15})
    .withMessage('Must be 15 symbols or less'),
  body('color').exists({checkFalsy: true, checkNull: true}).withMessage('Required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const trackFieldsValidationMiddleware = [
  body('title')
    .matches(/^[^.]+([\.]?[^.]+)?$/)
    .withMessage(
      "Can contain letters, numbers, !@#$%^&*()_-=+;'?,<>[]{}|/#!~' symbols, and one dot not first or last"
    )
    .bail()
    .exists({checkFalsy: true, checkNull: true})
    .withMessage('Required')
    .isLength({min: 1})
    .withMessage('Must be 1 symbols or more')
    .isLength({max: 64})
    .withMessage('Must be 64 symbols or less'),
  body('artistId').exists({checkFalsy: true, checkNull: true}).withMessage('Required'),
  body('genreId').exists({checkFalsy: true, checkNull: true}).withMessage('Required'),
  body('userId').exists({checkFalsy: true, checkNull: true}).withMessage('Required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({errors: errors.array()});
    }
    next();
  },
];

export const validateTrack = (req, res, next) => {
  const track = req?.files?.audio[0];
  if (!track) {
    return res.status(StatusCodes.BAD_REQUEST).json({message: 'Audio is required'});
  }
  const trackExtention = path.extname(track.originalname);
  const trackSize = track.size;
  if (trackExtention !== '.mp3') {
    deleteFiles(res, req);
    return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Only mp3 are allowed'});
  }
  if (trackSize >= 1e7) {
    deleteFiles(res, req);
    return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Audio is too large'});
  }

  next();
};

export const validateCover = (req, res, next) => {
  const cover = req?.files?.cover[0] || req?.file;
  if (!cover) {
    return res.status(StatusCodes.BAD_REQUEST).json({message: 'Cover is required'});
  }
  const [expectedType, expectedMaxSize] = [new Set(['.png', '.jpg', '.jpeg']), 3e6];
  const coverExtention = path.extname(cover.originalname);
  const coverSize = cover.size;
  if (!expectedType.has(coverExtention)) {
    deleteFiles(res, req);
    return res.status(StatusCodes.BAD_REQUEST).json({msg: 'PNG, JPEG or JPG are allowed'});
  }
  if (coverSize >= expectedMaxSize) {
    deleteFiles(res, req);
    return res.status(StatusCodes.BAD_REQUEST).json({msg: 'Cover is too large'});
  }

  next();
};
