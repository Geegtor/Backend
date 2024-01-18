import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

class FileService {
  constructor() {
    this.saveFile = this.saveFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  public saveFile(file, type) {
    try {
      const fileName = uuid.v4() + '.' + type;
      const filePath = path.resolve('static', fileName);
      file.mv(filePath);
      return fileName;
    } catch (e) {
      console.error(e);
      return 'Unsaved file';
    }
  }

  public deleteFile(file) {
    try {
      const filePath = path.resolve('static', file);
      fs.unlink(filePath, e => e && console.error(e));
      return 'Static file deleted';
    } catch (e) {
      console.error(e);
      return 'Not deleted';
    }
  }
}

export default FileService;
