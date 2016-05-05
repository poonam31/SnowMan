var guessWord = require('./guessWord');
var yargs = require('yargs');

var flags = yargs.usage('$0: Usage node app.js --play')
  .options('h', {
    alias: 'help',
    describe: 'Display Help'
  })
  .options('p', {
    alias: 'play',
    describe: 'Guess the word! You can have 5 misses.',
  })
  .argv;


if (flags.help) {
  yargs.showHelp();
  process.exit(0);
}

if (flags.play) {
  guessWord.run();
}