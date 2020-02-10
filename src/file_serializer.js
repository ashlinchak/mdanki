/* eslint-disable no-param-reassign */
const fs = require('fs');
const path = require('path');

const configs = require('./configs');
const CardParser = require('./parsers/card_parser');
const Media = require('./models/media');

/**
 * @typedef {import('./models/card').Card} Card
 * @typedef {import('./models/media').Media} Media
 */

/**
 * Serialize file to cards, media and deck name
 * @typedef {Object} ParsedData
 * @property {string} deckName
 * @property {[Card]} cards
 * @property {[Media]} media
 */

class FileSerializer {
  /**
   * @param {string} source File path
   */
  constructor(source) {
    this.source = source;
  }

  /**
   * @returns {ParsedData}
   */
  async transform() {
    const mdString = fs.readFileSync(this.source).toString();
    return this.splitByCards(mdString);
  }

  /**
   * @param {string} mdString Markdown string
   * @returns {ParsedData}
   * @private
   */
  async splitByCards(mdString) {
    let rawCards = mdString
      .split(new RegExp(configs.card.separator, 'm'))
      .map((line) => line.trim());

    const deckName = this.deckName(rawCards);

    // filter out deck title
    rawCards = rawCards.filter((str) => !str.startsWith(configs.deck.titleSeparator));

    const dirtyCards = await Promise.all(rawCards.map((str) => CardParser.parse(str)));
    const cards = dirtyCards
      .filter((card) => card)
      // card should have front and back sides
      .filter((card) => card.front && card.back);

    // get media from markdown file
    const media = this.mediaFromCards(cards);

    return {
      deckName,
      cards,
      media,
    };
  }

  /**
   * @param {[string]} rawCards The array of strings which represent cards' data
   * @returns {string}
   * @private
   */
  deckName(rawCards) {
    const deckName = rawCards
      .find((str) => str.match(new RegExp(configs.deck.titleSeparator)));

    if (!deckName) { return null; }

    return deckName.replace(/(#\s|\n)/g, '');
  }

  /**
   * Search media in cards and add it to the media collection
   * @param {[Card]} cards
   * @returns {[Media]}
   * @private
   */
  mediaFromCards(cards) {
    const mediaList = [];

    cards.forEach((card) => {
      card.front = this.prepareMediaForSide(card.front, mediaList);
      card.back = this.prepareMediaForSide(card.back, mediaList);
    });

    return mediaList;
  }

  /**
   * Prepare media from card's and prepare it for using
   * @param {string} side
   * @param {[Media]} mediaList
   * @private
   */
  prepareMediaForSide(side, mediaList) {
    const pattern = /src="([^"]*?)"/g;

    const prepare = (match, p1) => {
      const filePath = path.resolve(path.dirname(this.source), p1);
      const fileExt = path.extname(filePath);

      const data = fs.readFileSync(filePath);
      const media = new Media(data);

      media.fileName = `${media.checksum}${fileExt}`;

      const hasMedia = mediaList.some((item) => item.checksum === media.checksum);
      if (!hasMedia) {
        mediaList.push(media);
      }

      return `src="${media.fileName}"`;
    };

    return side.replace(pattern, prepare);
  }
}

module.exports = FileSerializer;
