const crypto = require('crypto');

/**
 * @typedef {Object} Media
 * @property {string} fileName
 * @property {any} data
 */

class Media {
  /**
   * @param {any} data
   * @param {string} [fileName] Checksum is the default value if not other specified
   */
  constructor(data, fileName) {
    this.data = data;
    this.fileName = fileName;
  }

  /**
   * @returns {string} File data digest
   */
  get checksum() {
    return crypto
      .createHash('md5')
      .update(this.data, 'utf8')
      .digest('hex');
  }
}

module.exports = Media;
