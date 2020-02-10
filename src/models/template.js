const {
  question: deaultQuestion,
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
    this.questionFormat = questionFormat || deaultQuestion;
    this.answerFormat   = answerFormat || defaultAnswer;
    this.css            = css || defaultCss;
  }
}

module.exports = Template;
