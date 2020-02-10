const fs = require('fs');
const path = require('path');
const { argv } = require('yargs');
const glob = require('glob');
const Promise = require('bluebird');

const FileSerializer = require('./file_serializer');
const configs = require('./configs');
const Deck = require('./models/deck');
const Media = require('./models/media');

const AVAILABLE_FILE_EXTENSIONS = ['.md', '.markdown'];

/**
 *  @typedef {import('./models/deck').Deck} Deck
 *  @typedef {import('./models/card').Card} Card
 *  @typedef {import('./models/media').Media} Media
 */

/**
 * Create anki cards from markdown files
 * @typedef {Object} Transformer
 * @property {string} sourcePath Path to markdown file(s)
 * @property {string} targetPath Path for storing .apkg file
 * @property {Deck} deck
 */

class Transformer {
  /**
   * @param {string} sourcePath Path to markdown file(s)
   * @param {string} targetPath Path for storing .apkg file
   */
  constructor(sourcePath, targetPath) {
    this.sourcePath = sourcePath;
    this.targetPath = targetPath;
    this.deck = null;
  }

  /**
   * Transform markdown files to .apkg file
   * @returns {void}
   */
  async transform() {
    this.validate();

    let deckName;
    const cards = [];
    const media = [];

    if (fs.lstatSync(this.sourcePath).isDirectory()) {
      const allowedExtStr = AVAILABLE_FILE_EXTENSIONS.map((ex) => ex.replace('.', '')).join(',');
      const files = glob.sync(`${this.sourcePath}/**/*.{${allowedExtStr}}`);

      await Promise.each(files, async (file) => {
        const fileSerializer = new FileSerializer(file);

        const {
          cards   : fileCards,
          media   : fileMedia,
        } = await fileSerializer.transform();
        cards.push(...fileCards);
        media.push(...fileMedia);
      });
    } else {
      const fileSerializer = new FileSerializer(this.sourcePath);
      const {
        deckName: fileDeckName,
        cards   : fileCards,
        media   : fileMedia,
      } = await fileSerializer.transform();
      deckName = fileDeckName;
      cards.push(...fileCards);
      media.push(...fileMedia);
    }

    if (!cards.length) {
      console.log('No cards found. Check you markdown file(s)');
      process.exit(1);
    }

    this.deck = new Deck(deckName || this.defaultDeckName());

    this.exportCards(cards, media);
  }

  /**
   * @returns {string} Default deck name
   * @private
   */
  defaultDeckName() {
    if (argv.deck) { return argv.deck; }

    return configs.deck.defaultName;
  }

  /**
   * @param {[Card]} cards
   * @param {[Media]} media
   * @returns {void}
   * @private
   */
  async exportCards(cards, media) {
    this.addResourcesToDeck();
    this.addCardsToDeck(cards);
    this.addMediaItemsToDeck(media);

    this.deck.save(this.targetPath);
  }

  /**
   * Adds required resources to deck
   * @returns {void}
   * @private
   */
  addResourcesToDeck() {
    // add media for code highlighting
    this.deck.addMedia(this.toMedia('_highlight.js', path.resolve(__dirname, '../resources/highlight.js')));
    this.deck.addMedia(this.toMedia('_prism.js', path.resolve(__dirname, '../resources/prism.js')));

    if (configs.code.template === 'dark') {
      this.deck.addMedia(this.toMedia('_highlight_dark.css', path.resolve(__dirname, '../resources/dark.css')));
    } else {
      this.deck.addMedia(this.toMedia('_highlight_default.css', path.resolve(__dirname, '../resources/default.css')));
    }
  }

  /**
   * @param {[Card]} cards
   * @returns {void}
   * @private
   */
  addCardsToDeck(cards) {
    cards.forEach((card) => this.deck.addCard(card));
  }

  /**
   * @param {[Media]} items
   * @returns {void}
   * @private
   */
  addMediaItemsToDeck(items) {
    items.forEach((item) => this.deck.addMedia(item));
  }

  /**
   * @param {string} fileName
   * @param {string} filePath
   * @returns {Media}
   * @private
   */
  toMedia(fileName, filePath) {
    const data = fs.readFileSync(filePath);
    return new Media(data, fileName);
  }

  /**
   * @returns {void}
   * @private
   */
  validate() {
    this.validatePath(this.sourcePath);
    this.validateExt(this.sourcePath);
  }

  /**
   * @param {string} checkPath
   * @returns {void|process.exit(1)}
   * @private
   */
  validatePath(checkPath) {
    if (!fs.existsSync(checkPath)) {
      console.log(`${checkPath} does not exists`);
      process.exit(1);
    }
  }

  /**
   * @param {string} filePath
   * @returns {void|process.exit(1)}
   * @private
   */
  validateExt(filePath) {
    const ext = path.extname(filePath);

    if (ext && !AVAILABLE_FILE_EXTENSIONS.includes(ext)) {
      console.log(`${filePath} has not allowed extension`);
      process.exit(1);
    }
  }
}


module.exports = Transformer;
