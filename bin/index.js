#! /usr/bin/env node'

const { program } = require('commander');

const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const { CaesarCipher } = require('../src/CaesarCipher');
const { CounterTransform } = require('../src/streams');
const { checkCorrectAction, checkFileExistence } = require('../src/checks');

program
  .requiredOption('-a, --action <action-type>', 'specify what to do with input (encode or decode)')
  .requiredOption('-s, --shift <shift-amount>', 'specify shift (integer)')
  .option('-i, --input <input-file-path>', 'specify path to input file')
  .option('-o, --output <output-file-path>', 'specify path to output file')

program.parse(process.argv);

/* Get cli options */
const options = program.opts();

let inputPath = options.input;
let outputPath = options.output;
let action = options.action;
let shiftAmount = options.shift;

/* Create std streams */
const stdin = process.stdin;
const stdout = process.stdout;
const stderr = process.stderr;

/* Check correct cli input */
if (!checkCorrectAction(options.action)) {
  stderr.write("Not valid action. Possible actions - encode, decode");
  process.exit(1)
};

if (inputPath) {
  if (!checkFileExistence(inputPath)) {
    stderr.write(`${inputPath} - doesn't exist`);
    process.exit(1)
  }
}

if (outputPath) {
  if (!checkFileExistence(outputPath)) {
    stderr.write(`${outputPath} - doesn't exist`);
    process.exit(1)
  }
}

/* Create cypher machine */
const counterTransform = new CounterTransform();
counterTransform.setCypherMachine(new CaesarCipher(shiftAmount, action === "encode" ? true : false));

if (inputPath && outputPath) {
  const readableStream = fs.createReadStream(path.resolve(inputPath));
  const writeableStream = fs.createWriteStream(path.resolve(outputPath), {
    flags: "a",
  });

  pipeline(
    readableStream,
    counterTransform,
    writeableStream,
    (res) => {
      console.log(res);
    }
  )
} else if (!inputPath && !outputPath) {
  pipeline(
    stdin,
    counterTransform,
    stdout,
    (res) => {
      console.log(res);
    }
  )
} else if (inputPath) {
  const readableStream = fs.createReadStream(path.resolve(inputPath));

  pipeline(
    readableStream,
    counterTransform,
    stdout,
    (res) => {
      console.log(res);
    }
  )
} else if (outputPath) {
  const writeableStream = fs.createWriteStream(path.resolve(outputPath), {
    flags: "a",
  });

  pipeline(
    stdin,
    counterTransform,
    writeableStream,
    (res) => {
      console.log(res);
    }
  )
};