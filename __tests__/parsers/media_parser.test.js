const fs = require('fs');
const axios = require('axios');

const MediaParser = require('../../src/parsers/media_parser');

jest.mock('fs');
jest.mock('axios');

describe('MediaParser', () => {
  let parser;

  beforeEach(() => {
    parser = new MediaParser('source.md');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('#parse', () => {
    test('returns a blank string', async () => {
      const data = await parser.parse('');

      expect(data).toEqual('');
    });

    test('returns the same card data', async () => {
      const data = await parser.parse('<h2 id="title">Title</h2>');

      expect(data).toEqual('<h2 id="title">Title</h2>');
    });

    test('parses locale media file', async () => {
      jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => 'data');

      const data = await parser.parse('<img src="test.png">');

      expect(data).toEqual('<img src="8d777f385d3dfec8815d20f7496026dc.png">');
      expect(parser.mediaList.length).toEqual(1);
      expect(parser.mediaList[0].data).toEqual('data');
      expect(parser.mediaList[0].fileName).toEqual('8d777f385d3dfec8815d20f7496026dc.png');
    });

    test('parses remote media file', async () => {
      jest.spyOn(axios, 'get').mockImplementationOnce(() => ({
        data: 'data',
      }));

      const data = await parser.parse('<img src="https://test.com/test.png">');

      expect(data).toEqual('<img src="8d777f385d3dfec8815d20f7496026dc.png">');
      expect(parser.mediaList.length).toEqual(1);
      expect(parser.mediaList[0].data).toEqual('data');
      expect(parser.mediaList[0].fileName).toEqual('8d777f385d3dfec8815d20f7496026dc.png');
    });
  });
});
