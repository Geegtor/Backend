import * as mm from 'music-metadata';
import fs from 'fs';

import {StatusCodes} from 'http-status-codes';

export const getDuration = (req, res, next) => {
  const path = req['files']?.audio[0]?.path;
  (async () => {
    try {
      const metadata = await mm.parseFile(path);
      req.body.duration = metadata.format.duration;
      next();
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: error.message});
    }
  })();
};

export const getFilePath = (req, res, next) => {
  req.body.audio = req['files']?.audio[0]?.filename;
  req.body.cover = req['files']?.cover[0]?.filename;

  next();
};

export const deleteFiles = (res, req) => {
  if (req.file) {
    const filePath = req.file.path;
    fs.unlink(filePath, (err) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: err.message });
      }
    });
    return;
  }
  Object.keys(req.files).forEach((key) => {
    const file = req.files[key][0];
    const filePath = file.path;
    fs.unlink(filePath, err => {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err.message});
      }
    });
  });
};
