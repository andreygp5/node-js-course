const { Transform } = require("stream");

class CounterTransform extends Transform {
  setCypherMachine(cypherMachine) {
    this.cypherMachine = cypherMachine;
  }
  _transform(chunk, encoding, callback) {
    try {
      const resultString = this.cypherMachine.process(chunk.toString('utf8'));

      callback(null, resultString);
    } catch (err) {
      callback(err);
    }
  }
}

module.exports = { CounterTransform };