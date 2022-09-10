const path = require('path');
const axios = require('axios');
const fs = require('fs');

const BaseParser = require('./base_parser');
const Media = require('../models/media');
const {
  getExtensionFromUrl,
  replaceAsync,
} = require('../utils');

/**
 * @typedef {import('../models/media').Media} Media
 * @typedef {import('./base_parser').BaseParser} BaseParser
 */

/**
 * @typedef {Object} MediaParser
 * @property {string} source
 * @property {[Media]} mediaList=[]
 */

class MediaParser extends BaseParser {
  constructor(source, options = {}) {
    super(options);
    this.source = source;
    this.mediaList = [];
    this.srcRe = new RegExp('src="([^"]*?)"', 'g');
  }

  /**
   * Prepare media from card's side
   * @param {string} side
   */
  parse(side) {
    return replaceAsync(side, this.srcRe, this.replacer.bind(this));
  }

  async replacer(match, p1) {
    let data;
    let fileExt;

    if (p1.startsWith('http')) {
      const resp = await axios.get(p1, {
        responseType: 'arraybuffer',
      });
      data = resp.data;
      fileExt = getExtensionFromUrl(p1);
    } else {
      const filePath = path.resolve(path.dirname(this.source), p1);
      fileExt = path.extname(filePath);
      data = fs.readFileSync(decodeURIComponent(filePath));
    }

    const media = new Media(data);
    media.fileName = `${media.checksum}${fileExt}`;

    this.addMedia(media);

    return `src="${media.fileName}"`;
  }

  addMedia(media) {
    const hasMedia = this.mediaList.some((item) => item.checksum === media.checksum);
    if (hasMedia) { return; }

    this.mediaList.push(media);
  }
}

module.exports = MediaParser;
