const fs = require('fs');
const glob = require('glob');

let Transformer = require('../src/transformer');
const Deck = require('../src/models/deck');

jest.mock('fs');
jest.mock('glob');


describe('Transformer', () => {
  let transformer;
  const sourceFilePath = 'file.md';

  describe('#transform', () => {
    const markdown = '# Deck title\n## Title\nbody\n![#image](image.png)';
    const sourceDirectoryPath = '/path/to/directory';

    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementationOnce(() => {});
      jest.spyOn(process, 'exit').mockImplementationOnce(() => {});
    });

    describe('validations', () => {
      test('validates presence of source file', async () => {
        transformer = new Transformer('fake/path', 'path/to/anki.apkg');
        jest.spyOn(transformer, 'transformToDeck').mockResolvedValue();
        jest.spyOn(transformer, 'validateExt').mockImplementation();

        await transformer.transform();

        expect(console.log).toHaveBeenLastCalledWith('fake/path does not exists');
        expect(process.exit).toHaveBeenLastCalledWith(1);
      });

      test('validates file extension', async () => {
        transformer = new Transformer('path/to/file.txt', 'path/to/anki.apkg');
        jest.spyOn(transformer, 'transformToDeck').mockResolvedValue();
        jest.spyOn(transformer, 'validatePath').mockImplementation();

        await transformer.transform();

        expect(console.log).toHaveBeenLastCalledWith('path/to/file.txt has not allowed extension');
        expect(process.exit).toHaveBeenLastCalledWith(1);
      });
    });

    describe('parse a directory', () => {
      beforeEach(() => {
        jest.spyOn(Transformer.prototype, 'addResourcesToDeck').mockImplementation();
        jest.spyOn(Transformer.prototype, 'defaultDeckName').mockReturnValue('deck name');
        jest.spyOn(Deck.prototype, 'save').mockResolvedValue({
          save: jest.fn(),
        });
        fs.lstatSync.mockReturnValue({
          isDirectory: () => true,
        });
        fs.readFileSync.mockReturnValue(markdown);
        fs.existsSync.mockReturnValue(true);
        glob.sync.mockReturnValue([sourceFilePath]);
      });

      beforeEach(async () => {
        transformer = new Transformer(sourceDirectoryPath, 'path/to/anki.apkg');
        await transformer.transform();
      });

      test('creates a deck', () => {
        expect(transformer.deck.save).toHaveBeenCalledWith('path/to/anki.apkg');
      });

      test('sets the default deck name', () => {
        expect(transformer.deck.name).toEqual('deck name');
      });
    });

    describe('parse a file', () => {
      beforeEach(() => {
        jest.spyOn(Transformer.prototype, 'addResourcesToDeck').mockImplementation();
        jest.spyOn(Deck.prototype, 'save').mockResolvedValue({
          save: jest.fn(),
        });
        fs.lstatSync.mockReturnValue({
          isDirectory: () => false,
        });
        fs.readFileSync.mockReturnValue(markdown);
        fs.existsSync.mockReturnValue(true);
      });

      beforeEach(async () => {
        transformer = new Transformer(sourceFilePath, 'path/to/anki.apkg');
        await transformer.transform();
      });

      test('creates a deck', () => {
        expect(transformer.deck.save).toHaveBeenCalledWith('path/to/anki.apkg');
      });

      test('sets a deck name based on the title from the markdown', () => {
        expect(transformer.deck.name).toEqual('Deck title');
      });
    });

    describe('no cards found', () => {
      beforeEach(() => {
        jest.spyOn(Transformer.prototype, 'validate').mockImplementation();
        jest.spyOn(Transformer.prototype, 'addResourcesToDeck').mockImplementation();
        jest.spyOn(Deck.prototype, 'save').mockResolvedValue({
          save: jest.fn(),
        });
        fs.lstatSync.mockReturnValue({
          isDirectory: () => false,
        });
        fs.readFileSync.mockReturnValue('markdown without cards');
      });

      beforeEach(async () => {
        transformer = new Transformer(sourceFilePath, 'path/to/anki.apkg');
        await transformer.transform();
      });

      test('exits process', () => {
        expect(console.log).toHaveBeenLastCalledWith('No cards found. Check you markdown file(s)');
        expect(process.exit).toHaveBeenLastCalledWith(1);
      });
    });
  });

  describe('#defaultDeckName', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test('generates deck name from passed arguments', () => {
      jest.mock('yargs', () => ({
        argv: { deck: 'deck name' },
      }));
      Transformer = require('../src/transformer');
      transformer = new Transformer(sourceFilePath, 'anki.apkg');

      expect(
        transformer.defaultDeckName(),
      ).toEqual('deck name');
    });

    test('generates deck name from default configs', () => {
      jest.mock('yargs', () => ({
        argv: { deck: null },
      }));
      Transformer = require('../src/transformer');
      transformer = new Transformer(sourceFilePath, 'anki.apkg');

      expect(
        transformer.defaultDeckName(),
      ).toEqual('mdanki');
    });
  });

  describe('required resources', () => {
    let deck;

    beforeEach(() => {
      deck = new Deck();
      jest.spyOn(deck, 'addMedia');
    });

    test('adds with dark template', () => {
      Transformer = require('../src/transformer');
      transformer = new Transformer(sourceFilePath, 'anki.apkg');
      transformer.deck = deck;

      transformer.addResourcesToDeck();

      expect(deck.addMedia).toHaveBeenCalledTimes(3);
      expect(deck.addMedia.mock.calls[2][0].fileName).toEqual('_highlight_dark.css');
    });

    test('adds with default template', () => {
      jest.resetModules();

      jest.mock('fs', () => ({
        readFileSync: () => '{"code":{"template":"default"}}',
      }));
      jest.mock('yargs', () => ({
        argv: { config: './config.json' },
      }));

      Transformer = require('../src/transformer');
      transformer = new Transformer(sourceFilePath, 'anki.apkg');
      transformer.deck = deck;

      transformer.addResourcesToDeck();

      expect(deck.addMedia).toHaveBeenCalledTimes(3);
      expect(deck.addMedia.mock.calls[2][0].fileName).toEqual('_highlight_default.css');
    });
  });
});
