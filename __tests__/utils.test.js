const {
  sanitizeString,
  trimArrayStart,
  trimArrayEnd,
  trimArray,
} = require('../src/utils');

describe('#sanitizeString', () => {
  test('trims a string', () => {
    expect(sanitizeString(' tag ')).toEqual('tag');
  });

  test('replaces spaces with underscore', () => {
    expect(sanitizeString('tag 1')).toEqual('tag_1');
  });
});

describe('#trimArray', () => {
  test('removes empty values from both sides of the array', () => {
    const array = [null, 1, ''];
    expect(trimArray(array)).toEqual([1]);
  });
});

describe('#trimArrayStart', () => {
  test('removes empty values in the array from the begging', () => {
    const array = [null, 1, ''];
    expect(trimArrayStart(array)).toEqual([1, '']);
  });
});

describe('#trimArrayEnd', () => {
  test('removes empty values in the array from the end', () => {
    const array = [null, 1, ''];
    expect(trimArrayEnd(array)).toEqual([null, 1]);
  });
});
