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

/**
 * Get extension from URL
 * @param {[string]} url
 * @returns {[string]}
 */
const getExtensionFromUrl = (url) => {
  const extension = url
    .split(/[#?]/)[0]
    .split('.')
    .pop()
    .trim();

  return `.${extension}`;
};

async function replaceAsync(str, regex, asyncFn) {
  const tasks = [];

  // fill replacers with fake call
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    tasks.push(promise);
  });

  const data = await Promise.all(tasks);

  return str.replace(regex, () => data.shift());
}

module.exports = {
  sanitizeString,
  trimArrayStart,
  trimArrayEnd,
  trimArray,
  getExtensionFromUrl,
  replaceAsync,
};
