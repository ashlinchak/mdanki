/* eslint-disable no-param-reassign */
const fs = require('fs');

const configs = require('./configs');
const CardParser = require('./parsers/card_parser');
const MediaParser = require('./parsers/media_parser');

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

    const {deckName, defaultTags} = await this.deckName(rawCards);

    // filter out deck title
    rawCards = rawCards.filter((str) => !str.startsWith(configs.deck.titleSeparator));

    const dirtyCards = await Promise.all(rawCards.map((str) => CardParser.parse(str)));
    const cards = dirtyCards
      .filter((card) => card)
      // card should have front and back sides
      .filter((card) => card.front && card.back);
    cards.forEach(card => card.tags = card.tags.concat(defaultTags))

    // get media from markdown file
    const media = await this.mediaFromCards(cards);

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
  async deckName(rawCards) {
    const titleRe = new RegExp(configs.deck.titleSeparator)
    const deckCard = rawCards
      .find((str) => str.match(titleRe));

    if (!deckCard) { return {deckName: null}; }

    var card = await CardParser.parse(deckCard);
    const deckName = deckCard.split("\n").find((l) => l.match(titleRe)).replace(/(#\s|\n)/g, '');

    return {
      deckName,
      defaultTags: card.tags
    }
  }
  
  /**
   * Search media in cards and add it to the media collection
   * @param {[Card]} cards
   * @returns {[Media]}
   * @private
   */
  async mediaFromCards(cards) {
    const mediaParser = new MediaParser(this.source);

    for (const card of cards) {
      card.front = await mediaParser.parse(card.front);
      card.back = await mediaParser.parse(card.back);
    }

    return mediaParser.mediaList;
  }
}

module.exports = FileSerializer;
