const Card = require('../../src/models/card');

describe('Card', () => {
  let card;

  beforeEach(() => {
    card = new Card('front', 'back');
  });

  describe('#addTag', () => {
    test('adds a tag to tags', () => {
      card.addTag('tag');

      expect(card.tags).toEqual(['tag']);
    });

    test('sanitizes tag names', () => {
      card.addTag(' tag1 ');
      card.addTag('tag 2');

      expect(card.tags[0]).toEqual('tag1');
      expect(card.tags[1]).toEqual('tag_2');
    });

    test('does not add empty string', () => {
      card.addTag(' ');

      expect(card.tags.length).toEqual(0);
    });
  });
});
