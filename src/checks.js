const fs = require('fs');
const path = require('path');

function checkCorrectAction(action) {
  const possibleActions = ["encode", "decode"];

  if (!possibleActions.includes(action)) return false;

  return true;
}

function checkFileExistence(filePath) {
  const normalizedPath = path.resolve(filePath);

  fs.access(normalizedPath, (err) => {
    if (err) return false;
  })

  try {
    fs.lstatSync(filePath).isFile();
  } catch {
    return false;
  }

  return true;
}

module.exports = { checkCorrectAction, checkFileExistence };