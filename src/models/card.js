const { sanitizeString } = require('../utils');

/**
 * @typedef {Object} Card
 * @property {string} front
 * @property {string} back
 * @property {[string]} [tags=[]]
 */

class Card {
  /**
   * @param {string} front
   * @param {string} back
   * @param {[string]} tags
   */
  constructor(front, back, tags = []) {
    this.front = front;
    this.back = back;
    this.tags = tags;
  }

  /**
   * Add tag to card in supported format
   * @param {string} dirtyTag
   * @returns {void}
   */
  addTag(dirtyTag) {
    const tag = sanitizeString(dirtyTag);
    if (tag) {
      this.tags.push(tag);
    }
  }
}

module.exports = Card;
