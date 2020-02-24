const {
  question: defaultQuestion,
  answer: defaultAnswer,
  css: defaultCss,
} = require('../configs').template.formats;

/**
 * @typedef {Object} Template
 * @property {string} questionFormat
 * @property {string} answerFormat
 * @property {string} css
 */

class Template {
  /**
   * @param {string} questionFormat
   * @param {string} answerFormat
   * @param {string} css
   */
  constructor(questionFormat, answerFormat, css) {
    this.questionFormat = questionFormat || defaultQuestion;
    this.answerFormat   = answerFormat || defaultAnswer;
    this.css            = css || defaultCss;
  }
}

module.exports = Template;
