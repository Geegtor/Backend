import multer from 'multer';
import * as uuid from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'static/');
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, uuid.v4() + ext);
  },
});

const multerStorage = multer({
  storage,
});

export default multerStorage;
