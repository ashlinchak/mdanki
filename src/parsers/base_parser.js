/**
 * Base parser which should be inherited
 * @typedef {Object} BaseParser
 */

class BaseParser {
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Create a new instance of parser and run parse() method
   * parse() method should be implemented in the inherited class
   * @param {string} data
   * @param {Object} options
   */
  static parse(data, options = {}) {
    return new this(options).parse(data);
  }
}

module.exports = BaseParser;
