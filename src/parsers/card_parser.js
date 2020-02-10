const BaseParser = require('./base_parser');
const MdParser = require('./md_parser');
const Card = require('../models/card');
const configs = require('../configs');
const { trimArray } = require('../utils');

/**
 * @typedef {import('../models/card').Card} Card
 * @typedef {import('./base_parser').BaseParser} BaseParser
 * /

/**
 * Parse a string to Card model
 * @typedef {Object} ParsedCardLine
 * @implements {BaseParser}
 * @property {[string]} front
 * @property {[string]} back
 * @property {[string]} tags
 */

class CardParser extends BaseParser {
  constructor({ convertToHtml = true } = {}) {
    super({ convertToHtml });
    this.splitRe = new RegExp(`^${configs.card.frontBackSeparator}$`, 'm');
    this.tagRe = new RegExp(configs.card.tagPattern);
  }

  /**
   * Parse a string to Card model
   * @param {string} string Card in string
   * @returns {Promise<Card>}
   */
  async parse(string = '') {
    const cardLines = string
      .split(this.splitRe)
      .map((item) => item.split('\n'))
      .map((arr) => arr.map((str) => str.trimEnd()));

    // not allowed cards with only front side
    if (cardLines.length === 1 && !cardLines[0].filter((line) => line).length) {
      return null;
    }
    const { front, back, tags } = this.parseCardLines(cardLines);

    if (this.options.convertToHtml) {
      const frontHtml = await this.linesToHtml(front);
      const backHtml = await this.linesToHtml(back);

      return new Card(frontHtml, backHtml, tags);
    }

    return new Card(front, back, tags);
  }

  /**
   * @param {[string]} cardLines
   * @returns {ParsedCardLine}
   * @private
   */
  parseCardLines(cardLines) {
    const front = [];
    const back  = [];
    const tags  = [];

    const fillBackAndTags = (line) => {
      // set tags
      if (this.tagRe.test(line)) {
        tags.push(...this.parseTags(line));
        return;
      }

      // set back
      // skip first blank lines
      if (back.length === 0 && !line) { return; }

      back.push(line);
    };

    if (cardLines.length === 1) {
      trimArray(cardLines[0])
        .forEach((line) => {
          // we should set front first
          if (front.length === 0) {
            front.push(line);
            return;
          }

          fillBackAndTags(line);
        });
    } else {
      // front card has multiple lines
      front.push(...cardLines[0]);

      trimArray(cardLines[1])
        .forEach((line) => fillBackAndTags(line));
    }

    return {
      front: trimArray(front),
      back : trimArray(back),
      tags : trimArray(tags),
    };
  }

  /**
   * @param {string} line
   * @returns {[string]}
   * @private
   */
  parseTags(line) {
    const data = line.split(' ')
      .map((str) => str.trim())
      .map((str) => {
        const parts = this.tagRe.exec(str);
        if (!parts) { return null; }

        return parts[1];
      })
      .filter((str) => str);

    return data;
  }

  /**
   * Convert card lines to html
   * @param {[string]} lines
   * @returns {Promise<string>}
   * @private
   */
  async linesToHtml(lines) {
    const string = lines.join('\n');

    return MdParser.parse(string);
  }
}


module.exports = CardParser;
