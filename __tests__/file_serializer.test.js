const fs = require('fs');
const FileSerializer = require('../src/file_serializer');

jest.mock('fs');


describe('FileSerializer', () => {
  let serializer;
  const filePath = 'file.md';
  const mediaPath = 'image.png';
  let markdown;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('#transform', () => {
    const readFileSyncMock = (p) => {
      if (p === filePath) { return markdown; }
      if (p.includes(mediaPath)) { return 'data'; }
      return null;
    };

    beforeEach(() => {
      markdown = `# Deck name\n## Title\nbody\n![media](${mediaPath})`;
      jest.spyOn(fs, 'readFileSync').mockImplementation(readFileSyncMock);
    });

    test('serializes a markdown to the deck data', async () => {
      serializer = new FileSerializer(filePath);

      const {
        deckName,
        cards,
        media,
      } = await serializer.transform();

      expect(deckName).toEqual('Deck name');
      expect(cards.length).toEqual(1);
      expect(cards[0].front.replace(/\n/g, '')).toEqual('<h2 id="title">Title</h2>');
      expect(cards[0].back.replace(/\n/g, '')).toEqual('<p>body<br><img src="8d777f385d3dfec8815d20f7496026dc.png" alt="media"></p>');
      expect(media.length).toEqual(1);
      expect(media[0].data).toEqual('data');
      expect(media[0].fileName).toEqual('8d777f385d3dfec8815d20f7496026dc.png');
    });

    test('find first deckName', async () => {
      markdown = `# Deck name\n[#tag2]()\n## Title\nbody\n[#tag]()`;
      serializer = new FileSerializer(filePath);

      const { deckName, cards } = await serializer.transform();

      expect(deckName).toEqual('Deck name');
      expect(cards.length).toEqual(1);
      expect(cards[0].tags[0]).toEqual('tag');
      expect(cards[0].tags[1]).toEqual('tag2');
    });


    test('returns without a deck name if it\'s not specified in the markdown', async () => {
      markdown = `## Title\nbody\n![media](${mediaPath})`;
      serializer = new FileSerializer(filePath);

      const { deckName } = await serializer.transform();

      expect(deckName).toEqual(null);
    });

    test('keeps media unique', async () => {
      markdown = `## Title\nbody\n![media](${mediaPath})![media](${mediaPath})`;
      serializer = new FileSerializer(filePath);

      const { media } = await serializer.transform();

      expect(media.length).toEqual(1);
    });
  });
});
