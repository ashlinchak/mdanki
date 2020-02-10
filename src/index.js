#!/usr/bin/env node
const path = require('path');
const Transformer = require('./transformer');


// eslint-disable-next-line no-unused-expressions
require('yargs')
  .command(
    '$0 <source> <target>',
    'Convert Markdown file into anki\'s apkg file for importing.',
    () => {},
    async (argv) => {
      const transformer = new Transformer(
        path.resolve(argv.source),
        path.resolve(argv.target),
      );
      await transformer.transform();
    },
  )
  .example('$0 study.md anki.apk --deck Study')
  .option('config', {
    type       : 'string',
    description: 'Configuration file location',
  })
  .option('deck', {
    type       : 'string',
    description: 'Deck name',
  })
  .argv;
