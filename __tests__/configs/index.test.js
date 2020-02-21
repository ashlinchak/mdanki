jest.mock('../../src/configs/settings', () => ({
  setting: 'value',
}));


describe('configs', () => {
  let configs;

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe('without provided config file', () => {
    beforeEach(() => {
      jest.mock('yargs', () => ({
        argv: {},
      }));
    });

    test('returns default settings', () => {
      configs = require('../../src/configs');

      expect(configs).toEqual({ setting: 'value' });
    });
  });

  describe('with provided config file', () => {
    beforeEach(() => {
      jest.mock('fs', () => ({
        readFileSync: () => '{"setting":"another value"}',
      }));
      jest.mock('yargs', () => ({
        argv: { config: './config.json' },
      }));
    });

    test('returns overridden settings', () => {
      configs = require('../../src/configs');

      expect(configs).toEqual({ setting: 'another value' });
    });

    test('handles an error', () => {
      jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw new Error('cannot parse');
      });
      jest.spyOn(console, 'log').mockImplementationOnce(() => {});

      configs = require('../../src/configs');

      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log.mock.calls[0][0].message).toEqual('cannot parse');
    });
  });
});
