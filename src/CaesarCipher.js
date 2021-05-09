class CaesarCipher {
  process(str, shiftAmount, encode) {
    this.result = "";

    shiftAmount = shiftAmount % 26;

    for (let i = 0; i < str.length; i++) {
      let letter = str[i];

      if (/[a-z]/i.test(letter)) {
        letter = this.getTransformedLetter(letter.charCodeAt(0), shiftAmount, encode)
      }

      this.result += letter;
    }

    return this.result;
  }

  getTransformedLetter(letterCode, shiftNumber, encode) {

    const getNewCode = (balanceNumber) => {
      let newCode = 0;

      if (encode) {
        newCode = letterCode - balanceNumber + shiftNumber;
      } else {
        newCode = letterCode - balanceNumber - shiftNumber;
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