const MdParser = require('../../src/parsers/md_parser');

jest.mock('marked');
jest.mock('prismjs');
const marked = require('marked');
const Prism = require('prismjs');

describe('MdParser', () => {
  let parser;

  beforeEach(() => {
    parser = new MdParser();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('#parse', () => {
    test('calls the marked parse method with the specified string', async () => {
      jest.spyOn(marked, 'parse').mockImplementation((str, cb) => {
        cb(null, str);
      });

      const data = await parser.parse('string');

      expect(data).toEqual('string');
    });

    test('returns an error', async () => {
      jest.spyOn(marked, 'parse').mockImplementation((str, cb) => {
        cb(new Error('cannot parse'));
      });

      await parser.parse('string')
        .catch((err) => {
          expect(err.message).toEqual('cannot parse');
        });
    });
  });

  describe('#highlight', () => {
    const originLanguages = Prism.languages;

    beforeEach(() => {
      Prism.languages = {
        js  : 'js lang',
        bash: 'bash lang',
      };
      jest.spyOn(Prism, 'highlight').mockReturnValue('highlighted code');
    });

    afterEach(() => {
      Prism.languages = originLanguages;
    });

    test('calls the prism highlight method', () => {
      const data = parser.highlight('code', 'js');

      expect(data).toEqual('highlighted code');
    });

    test('calls the prism highlight method with a default language', () => {
      const data = parser.highlight('code', null);

      expect(data).toEqual('highlighted code');
      expect(Prism.highlight).toHaveBeenCalledWith('code', 'bash lang', 'bash');
    });

    test('returns a raw code for not aware language in prism', () => {
      const data = parser.highlight('code', 'fake');

      expect(data).toEqual('code');
    });
  });
});
