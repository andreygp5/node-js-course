class CaesarCipher {
  constructor(shiftAmount, encode) {
    this.shiftAmount = shiftAmount;
    this.encode = encode;
  }
  process(str) {
    this.result = "";

    /* Handle negative shift */
    if (this.shiftAmount < 0) {
      this.encode = !this.encode;
      this.shiftAmount = Math.abs(this.shiftAmount);
      return this.process(str);
    }

    this.shiftAmount = this.shiftAmount % 26;

    for (let i = 0; i < str.length; i++) {
      let letter = str[i];

      if (/[a-z]/i.test(letter)) {
        letter = this.getTransformedLetter(letter.charCodeAt(0))
      }

      this.result += letter;
    }

    return this.result;
  }

  getTransformedLetter(letterCode) {

    const getNewCode = (balanceNumber) => {
      let newCode = 0;

      if (this.encode) {
        newCode = letterCode - balanceNumber + this.shiftAmount;
      } else {
        newCode = letterCode - balanceNumber - this.shiftAmount;
      }

      newCode = ((newCode % 26) + 26) % 26;
      newCode = newCode + balanceNumber;

      return newCode;
    }

    if (letterCode >= 97) {
      return String.fromCharCode(getNewCode(97));
    } else {
      return String.fromCharCode(getNewCode(65));
    }

  }
}

module.exports = { CaesarCipher };