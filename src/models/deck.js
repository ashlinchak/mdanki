const fs = require('fs');
const { default: AnkiExport } = require('anki-apkg-export');

const Template = require('./template');

/**
 * @typedef {import('./template').Template} Template
 * @typedef {import('./card').Card} Card
 * @typedef {import('./media').Media} Media
 * @typedef {import('anki-apkg-export').default} AnkiExport
 */

/**
 * @typedef {Object} Deck
 * @property {string} name
 * @property {Template} template
 * @property {[Card]} cards
 * @property {Object} [options]
 */

class Deck {
  /**
   * @param {string} name
   * @param {Template} template
   * @param {Object} [options={}]
   */
  constructor(name, options = {}) {
    this.name = name;
    this.options = options;
    this.cards = [];
    this.mediaCollection = [];
    this.template = new Template();
    this.ankiExport = new AnkiExport(this.name, this.template);
  }

  /**
   * @param {Card} card
   * @returns {void}
   */
  addCard(card) {
    this.cards.push(card);
  }

  /**
   * @param {Media} media
   * @returns {void}
   */
  addMedia(media) {
    this.mediaCollection.push(media);
  }

  /**
   * Save deck in a file which is available for importing to Anki
   * @param {string} target File path
   * @returns {void}
   */
  async save(target) {
    this.addDataToAnkiExporter();
    await this.export(target);
  }

  /**
   * Add cards and media to Anki exporter
   * @returns {void}
   * @private
   */
  addDataToAnkiExporter() {
    // cards
    this.cards.forEach((card) => {
      const { front, back, tags } = card;
      this.ankiExport.addCard(front, back, { tags });
    });

    // media
    this.mediaCollection.forEach((media) => {
      this.ankiExport.addMedia(media.fileName, media.data);
    });
  }

  /**
   * @param {string} target File path
   * @private
   */
  async export(target) {
    try {
      const zip = await this.ankiExport.save();
      fs.writeFileSync(target, zip, 'binary');
      console.log(`The deck "${this.name}" has been generated in ${target}`);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Deck;
