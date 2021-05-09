#! /usr/bin/env node'

const { program } = require('commander');

const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const { CaesarCipher } = require('../src/CaesarCipher');
const { CounterTransform } = require('../src/streams');


program
  .requiredOption('-a, --action <action-type>', 'specify what to do with input (encode or decode)')
  .requiredOption('-s, --shift <shift-amount>', 'specify shift (integer)')
  .option('-i, --input <input-file-path>', 'specify path to input file')
  .option('-o, --output <output-file-path>', 'specify path to output file')

program.parse(process.argv);

const options = program.opts();

let inputPath = options.input;
let outputPath = options.output;
let action = options.action;
let shiftAmount = options.shift;

if (!checkCorrectAction(options.action)) {
  console.log("Not valid action. Possible actions - encode, decode");
  process.exit()
};

if (inputPath && outputPath) {
  checkCorrectPaths([path.resolve(inputPath), path.resolve(outputPath)]);
};

const readableStream = fs.createReadStream(path.resolve(inputPath));
const writeableStream = fs.createWriteStream(path.resolve(outputPath), {
  flags: "a",
});
const counterTransform = new CounterTransform();

counterTransform.setCypherMachine(new CaesarCipher(shiftAmount, action === "encode" ? true : false));

pipeline(readableStream, counterTransform, writeableStream,
  (res) => {
    console.log(res);
  })

function checkCorrectAction(action) {
  const possibleActions = ["encode", "decode"];

  if (!possibleActions.includes(action)) return false;

  return true;
}

function checkCorrectPaths(paths) {
  paths.forEach((filePath) => {
    filePath = path.resolve(filePath);
    fs.access(filePath, (err) => {
      if (err) {
        console.log(`${filePath} - doesn't exist`);
        process.exit();
      }
    });
    fs.lstat(filePath, (err, stats) => {
      if (err) {
        console.log(`Problems with - ${filePath}`);
        process.exit();
      } else {
        if (!stats.isFile()) {
          console.log(`${filePath} - isn't a file`);
          process.exit();
        }
      }
    })
  })
}