const fs = require('fs');
const ankiExport = require('anki-apkg-export');

const Deck = require('../../src/models/deck');
const Card = require('../../src/models/card');
const Media = require('../../src/models/media');

jest.mock('fs');
jest.mock('anki-apkg-export');


describe('Deck', () => {
  let deck;

  beforeEach(() => {
    deck = new Deck('deck name');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('#addCard', () => {
    test('adds a card to the collection', () => {
      deck.addCard('card');

      expect(deck.cards.length).toEqual(1);
    });
  });

  describe('#addMedia', () => {
    test('adds a media item to the collection', () => {
      deck.addMedia('media');

      expect(deck.mediaCollection.length).toEqual(1);
    });
  });

  describe('#save', () => {
    beforeEach(() => {
      ankiExport.__setSaveReturnValue('zip');
      jest.spyOn(console, 'log').mockImplementation(() => {});
      deck = new Deck('deck name');
      deck.addCard(new Card('front', 'back', ['tag', 'another_tag']));
      deck.addMedia(new Media('data', 'image.png'));
    });

    test('exports a card and a media item to the apkg file', async () => {
      await deck.save('anki.apkg');

      expect(fs.writeFileSync).toHaveBeenCalledWith('anki.apkg', 'zip', 'binary');
      expect(console.log).toHaveBeenCalledWith('The deck "deck name" has been generated in anki.apkg');
    });

    test('catches an error', async () => {
      jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => { throw new Error('Cannot write file'); });

      await deck.save('anki.apkg');

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log.mock.calls[0][0].message).toEqual('Cannot write file');
    });
  });
});
