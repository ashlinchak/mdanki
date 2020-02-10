const settings = {
  code: {
    defaultLanguage: 'bash',
    template       : 'dark', // [default | dark]
  },
  card: {
    separator         : '(?=^##\\s)',
    frontBackSeparator: '%',
    tagPattern        : '^\\[#(.*)\\]',
  },
  deck: {
    titleSeparator: '^#\\s',
    defaultName   : 'mdanki',
  },
  template: {
    formats: {
      question: '{{Front}}<link rel="stylesheet" href="_highlight_default.css"><link rel="stylesheet" href="_highlight_dark.css"></link><script>var script;"undefined"==typeof hljs&&((script=document.createElement("script")).src="_prism.js",script.async=!1,document.head.appendChild(script));(script=document.createElement("script")).src="_highlight.js",script.async=!1,document.head.appendChild(script),document.head.removeChild(script);</script>',
      answer  : '{{FrontSide}}\n\n<hr id="answer">\n\n{{Back}}',
      css     : '.card {\n font-family: Arial,"Helvetica Neue",Helvetica,sans-serif;\n font-size: 16px;\n color: black;\nbackground-color: white;\n}\ncode[class*="language-"],pre[class*="language-"] {\n font-size: 0.9em !important;\n}',
    },
  },
};

module.exports = settings;
