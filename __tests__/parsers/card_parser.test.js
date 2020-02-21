const CardParser = require('../../src/parsers/card_parser');


describe('CardParser', () => {
  let parser;
  const markdown = '## Title\nbody\n[#tag]()';
  const markdownWithMultipleLines = '## Title\nfront\n%\nback\n[#tag]()';

  beforeEach(() => {
    parser = new CardParser();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('#parse', () => {
    test('returns null for a blank string', async () => {
      const data = await parser.parse(' ');

      expect(data).toEqual(null);
    });

    test('returns null when undefined is passed', async () => {
      const data = await parser.parse(undefined);

      expect(data).toEqual(null);
    });

    test('creates a card with HTML sides', async () => {
      const card = await parser.parse(markdown);

      expect(card.front).toEqual('<h2 id="title">Title</h2>\n');
      expect(card.back).toEqual('<p>body</p>\n');
      expect(card.tags.length).toEqual(1);
      expect(card.tags[0]).toEqual('tag');
    });

    test('creates a card with raw sides', async () => {
      parser.options.convertToHtml = false;
      const card = await parser.parse(markdown);

      expect(card.front).toEqual('## Title');
      expect(card.back).toEqual('body');
      expect(card.tags.length).toEqual(1);
      expect(card.tags[0]).toEqual('tag');
    });

    test('creates a multi-line card with HTML sides', async () => {
      const card = await parser.parse(markdownWithMultipleLines);

      expect(card.front.replace(/\n/g, '')).toEqual('<h2 id="title">Title</h2><p>front</p>');
      expect(card.back).toEqual('<p>back</p>\n');
      expect(card.tags.length).toEqual(1);
      expect(card.tags[0]).toEqual('tag');
    });

    test('skips first blank lines for back', async () => {
      const card = await parser.parse('## Title\n \nbody');

      expect(card.front.replace(/\n/g, '')).toEqual('<h2 id="title">Title</h2>');
      expect(card.back.replace(/\n/g, '')).toEqual('<p>body</p>');
    });
  });
});
