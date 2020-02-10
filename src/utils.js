/**
 * Trim string and replaces spaces with underscore
 * Used for making tags
 * @param {string} str
 * @returns {string}
 */
const sanitizeString = (str) => str
  .trim()
  .replace(/\s/g, '_');

/**
 * Trim array from end
 * @param {[string]} array
 * @returns {[string]}
 */
const trimArrayEnd = (array) => {
  const trimmedArray = [];
  let added = false;

  for (let i = array.length - 1; i >= 0; i -= 1) {
    if (array[i] || added) {
      trimmedArray.unshift(array[i]);
      added = true;
    }
  }

  return trimmedArray;
};

/**
 * Trim array from start
 * @param {[string]} array
 * @returns {[string]}
 */
const trimArrayStart = (array) => {
  const trimmedArray = [];
  let added = false;

  for (let i = 0; i < array.length; i += 1) {
    if (array[i] || added) {
      trimmedArray.push(array[i]);
      added = true;
    }
  }

  return trimmedArray;
};

/**
 * Trim array
 * @param {[string]} array
 * @returns {[string]}
 */
const trimArray = (array) => trimArrayEnd(
  trimArrayStart(array),
);

module.exports = {
  sanitizeString,
  trimArrayStart,
  trimArrayEnd,
  trimArray,
};
