// npm test Crypto-test.js
jest
  .dontMock('../source/components/Crypto')
  .dontMock('classnames')
  ;

// import * as Crypto from '../source/components/Crypto';
// import * as CryptoJS from '../source/components/aes';
// import '../source/components/aes.js';
// const CryptoJS = require('../source/components/aes.js');
// var CryptoJS = require('../source/components/aes')
// console.log(global.moment);
// import sha256 from 'crypto-js/sha256';
// https://www.npmjs.com/package/aes-js
// var aesjs = require('aes-js');

//import CryptoAES from 'crypto-js/aes'
//import CryptoJS from 'crypto-js';
//var CryptoJS = require("crypto-js");
import * as Crypto from '../source/components/Crypto';


describe('EncryptData and DecryptData suite', () => {

  it('Simple CryptoJS Test', () => {

    // var sha256Result = sha256("none" + "world");
    // eslint-disable-next-line no-console
    // console.log(sha256Result);

    // var message = "My message";
    // var cipherKey = 'secret key 123';
    // var encryptMessage = CryptoAES.encrypt(message, cipherKey);
    // var decryptedBytes = CryptoAES.decrypt(encryptMessage.toString(), cipherKey);
    // var plaintext = decryptedBytes.toString(CryptoAES.Utf8)
    // // eslint-disable-next-line no-console
    // console.log(encryptMessage.toString());
    // // eslint-disable-next-line no-console
    // console.log(decryptedMessage.toString());
    // // eslint-disable-next-line no-console
    // console.log(plaintext);


    //import CryptoJS from 'crypto-js';
    //var CryptoJS = require("crypto-js");
    // var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');     
    // // eslint-disable-next-line no-console
    // console.log(ciphertext.toString());
    // var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
    // var plaintext = bytes.toString(CryptoJS.enc.Utf8);     
    // // eslint-disable-next-line no-console
    // console.log(plaintext);

    var encryptedtext = Crypto.Encrypt('my message', 'secret key 123');     
    // eslint-disable-next-line no-console
    console.log(encryptedtext);
    var plaintext  = Crypto.Decrypt(encryptedtext, 'secret key 123');
    // eslint-disable-next-line no-console
    console.log(plaintext);


    // var message = "Message";
    // var encryptedAES = encrypt(message, "My Secret Passphrase");
    // var decryptedBytes = decrypt(encryptedAES, "My Secret Passphrase");
    // var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // var message = "Message";
    // var encryptedAES = CryptoJS.AES.encrypt(message, "My Secret Passphrase");
    // var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, "My Secret Passphrase");
    // var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
   
    // // eslint-disable-next-line no-console
    // console.log(encryptedAES);
    // // eslint-disable-next-line no-console
    // console.log(plaintext);

   expect(plaintext).toBe('my message');
  });

});

/*
describe('EncryptData and DecryptData suite', () => {

  it('Simple Encrypt/Dencrypt Test', () => {

    let password = 'password';
    let plaintext = 'clear and simple';
    let vector = Crypto.GenerateVector();

    Crypto.Encrypt(password, plaintext, vector).then(function(e){
      // eslint-disable-next-line no-console
      console.log(e);
    });


    expect(plaintext).toBe(plaintext);
  });

});
*/


/*
describe('Cipher and Decipher suite', () => {

  it('Simple Cipher/Decipher Test', () => {

    let salt = 'mySecretSalt';
    let text = 'the plain text';

    let myCipher = Crypto.Cipher(salt);
    let result = myCipher(text);

    let myDecipher = Crypto.Decipher(salt);
    let actualText = myDecipher(result);

    expect(actualText).toBe(text);
  });

});
*/