const Media = require('../../src/models/media');

describe('Media', () => {
  let media;

  beforeEach(() => {
    media = new Media('data', 'image.png');
  });

  describe('#checksum', () => {
    test('generates a digest', () => {
      expect(media.checksum).toEqual('8d777f385d3dfec8815d20f7496026dc');
    });
  });
});
