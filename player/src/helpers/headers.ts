import {StatusCodes} from 'http-status-codes';

export const headersMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS, DELETE, GET');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
};

export const trackHeaders = (req, res, fileSize) => {
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    res.statusCode = StatusCodes.PARTIAL_CONTENT;
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', chunksize);
    res.setHeader('Content-Type', 'audio/mpeg');
  } else {
    res.statusCode = StatusCodes.OK;
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'audio/mpeg');
  }
};
