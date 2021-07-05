/* eslint-disable no-console */
/* eslint-disable no-undef */


// https://stackoverflow.com/questions/47766755/using-crypto-js-in-react
// You gotta install crypto-js using
// npm install crypto-js
// In your js files, you have to import module you wanna use
// import sha256 from 'crypto-js/sha256';
// Now you can use those functions
// sha256(nonce + message);


// https://codepen.io/gabrielizalo/pen/oLzaqx?editors=1010

// https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
// var encryptedAES = CryptoJS.AES.encrypt("Message", "My Secret Passphrase");
// var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, "My Secret Passphrase");
// var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);

// https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js


// https://medium.com/@encryb/comparing-performance-of-javascript-cryptography-libraries-42fb138116f3
// https://github.com/encryb/simplecrypto
// https://diafygi.github.io/webcrypto-examples/
// https://github.com/diafygi/webcrypto-examples/
// https://dev.to/subterrane/i-learned-enough-web-crypto-to-be-dangerous-5b5j
// http://qnimate.com/post-series/web-cryptography-api-tutorial/
// http://qnimate.com/passphrase-based-encryption-using-web-cryptography-api/
// https://www.w3.org/TR/WebCryptoAPI/#dfn-Crypto
// https://www.w3.org/TR/WebCryptoAPI/

// https://stackoverflow.com/questions/17280390/can-local-storage-ever-be-considered-secure

// https://nodejs.org/api/crypto.html

// https://github.com/hakanson/todomvc-jquery-webcryptoapi
// https://www.youtube.com/watch?v=kqwaZ-LzDag&feature=youtu.be&list=PL-0yjdC10QYpmXI3l-PGK1od4kTWOjm_A

// https://dev.to/rdegges/please-stop-using-local-storage-1i04


// const crypto = require('crypto');
// Object.defineProperty(global.self, 'crypto', {
//   value: {
//     getRandomValues: arr => crypto.randomBytes(arr.length),
//   },
// });

//var vector = window.crypto.getRandomValues(new Uint8Array(16));
//var data  = "narayan prusty";
//var encrypted_data = null;


// http://qnimate.com/passphrase-based-encryption-using-web-cryptography-api/
// begin

function convertStringToArrayBufferView(str)
{
    var bytes = new Uint8Array(str.length);
    for (var iii = 0; iii < str.length; iii++) 
    {
        bytes[iii] = str.charCodeAt(iii);
    }
    return bytes;
}
function convertArrayBufferViewtoString(buffer)
{
    var str = "";
    for (var iii = 0; iii < buffer.byteLength; iii++) 
    {
        str += String.fromCharCode(buffer[iii]);
    }
    return str;
}

var password = "password";
var key = null;
/*
window.crypto.subtle.digest({ name: "SHA-256" }, convertStringToArrayBufferView(password)).then(function (result) {
    window.crypto.subtle.importKey("raw", result, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]).then(function (e) {
        key = e;
        encrypt_data();
    }, function (e) {
        console.log(e);
    });
}); 
*/

function encrypt_data()
{
    window.crypto.subtle.encrypt({name: "AES-CBC", iv: vector}, key, convertStringToArrayBufferView(data)).then(
        function(result){
            encrypted_data = new Uint8Array(result);
            decrypt_data();
        }, 
        function(e){
            console.log(e.message);
        }
    );
}       

var decrypted_data = null;

function decrypt_data()
{
    window.crypto.subtle.decrypt({name: "AES-CBC", iv: vector}, key, encrypted_data).then(
        function(result){
            decrypted_data = new Uint8Array(result);
            console.log(convertArrayBufferViewtoString(decrypted_data));
        },
        function(e){
            console.log(e.message);
        }
    );
}


function generateVector() {
    var vector = window.crypto.getRandomValues(new Uint8Array(16));
    return vector;
}

function decryptData(password2, encryptedtext2, vector2, callback) {
    window.crypto.subtle.digest({ name: "SHA-256" }, convertStringToArrayBufferView(password2)).then(function (result0) {
        window.crypto.subtle.importKey("raw", result0, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]).then(function (e) {
            key2 = e;
            window.crypto.subtle.decrypt({name: "AES-CBC", iv: vector2}, key2, encryptedtext2).then(
                function(result2){
                    decrypted_data2 = new Uint8Array(result2);
                    //console.log(convertArrayBufferViewtoString(decrypted_data2));
                    callback(decrypted_data2);
                },
                function(e){
                    console.log(e.message);
                }
            );
        }, function (e) {
            console.log(e);
        });
    });
}

function encryptData(password1, plaintext1, vector1, callback) {
    window.crypto.subtle.digest({ name: "SHA-256" }, convertStringToArrayBufferView(password1)).then(function (result0) {
        window.crypto.subtle.importKey("raw", result0, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]).then(function (e) {
            key1 = e;
            window.crypto.subtle.encrypt({name: "AES-CBC", iv: vector1}, key1, convertStringToArrayBufferView(plaintext1)).then(
                function(result1){
                    encrypted_data1 = new Uint8Array(result1);
                    callback(encrypted_data1, vector1);
                }, 
                function(e){
                    console.log(e.message);
                }
            );
        }, function (e) {
            console.log(e);
        });
    });
}
const encryptData1 = (password1, plaintext1, callback) => new Promise((resolve, reject) => {
    encryptData(password1, plaintext1, callback).then(function(r) {
        callback = resolve;
    });
});
const encryptData2 = (p1, t1, succ, err) => encryptData1(p1, t1).then(succ).catch(err);


// end
// http://qnimate.com/passphrase-based-encryption-using-web-cryptography-api/





let cipher = salt => {
    let textToChars = text => text.split('').map(c => c.charCodeAt(0))
    let byteHex = n => ("0" + Number(n).toString(16)).substr(-2)
    let applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)    

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('')
}

let decipher = salt => {
    let textToChars = text => text.split('').map(c => c.charCodeAt(0))
    //let saltChars = textToChars(salt)
    let applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code)
    
    return encoded => encoded.match(/.{1,2}/g)
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('')
}

// https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
// let myCipher = cipher('mySecretSalt')
// myCipher('the secret string')   // --> "7c606d287b6d6b7a6d7c287b7c7a61666f"
// let myDecipher = decipher('mySecretSalt')
// myDecipher("7c606d287b6d6b7a6d7c287b7c7a61666f")    // --> 'the secret string'

var CryptoJS = require("crypto-js");

function encrypt(message, key)
{
    return CryptoJS.AES.encrypt(message, key).toString();
}
function decrypt(encryptedMessage, key)
{
    try
    {
        return CryptoJS.AES.decrypt(encryptedMessage, key).toString(CryptoJS.enc.Utf8);
    }
    catch(err)
    {        
        return err.message;
    }
}

export {encrypt as Encrypt};
export {decrypt as Decrypt};
export {cipher as xCipher};
export {decipher as xDecipher};
export {encryptData as xEncryptData};
export {encryptData1 as xEncryptData1};
export {encryptData2 as xEncryptData2};
export {decryptData as xDecryptData};
export {generateVector as xGenerateVector};


/*
  const generatedIv = generateIv();
  let generatedKey;
  generateKey()
    .then(key => {
      generatedKey = key;
      // you need to return something if you want the next .then to get anything
      return encryptData(encodeText("Hello World"), generatedKey, generatedIv);
    }).then(encrypted => {
      console.log("encrypted is an ArrayBuffer:", encrypted instanceof ArrayBuffer)
    }).catch(
      err => console.error(err)
    );

  function encodeText(data) {
    if ('TextEncoder' in window) {
      return new TextEncoder('utf-8').encode(data);
    }
    return undefined;
  }

  function generateIv() {
    return window.crypto.getRandomValues(new Uint8Array(12));
  }

  function generateKey() {
    return window.crypto.subtle.generateKey({
      name: 'AES-GCM',
      length: 256
    }, true, [
        'encrypt',
        'decrypt'
      ]);
  }

  function encryptData(data, key, iv) {
    return window.crypto.subtle.encrypt({
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128
    }, key, data);
  }
*/





/*

function functionOne(x) { 
    //alert(x); 
}
function functionTwo(var1, callback) {
    callback(var1);
}
functionTwo(2, functionOne);


async function f1() {
    return Promise.resolve(1);
}
//f1().then(alert); // 1

async function f2() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 1000)
    });
    let result = await promise; // wait till the promise resolves (*)
    alert(result); // "done!"
}
//f2();


// ES6 
var isMomHappy = false;
var willIGetNewPhone = new Promise(
    function (resolve, reject) {
        if (isMomHappy) {
            var phone = { brand: 'Samsung', color: 'black' };
            resolve(phone); // fulfilled
        } else {
            var reason = new Error('mom is not happy');
            reject(reason); // reject
        }
    }
);
var showOff = function (phone) {
    var message = 'Hey friend, I have a new ' + phone.color + ' ' + phone.brand + ' phone';
    return Promise.resolve(message);
};
var askMom = function () {
    willIGetNewPhone
        .then(showOff) // chain it here    
        .then(function (fulfilled) {    // yay, you got a new phone
            console.log(fulfilled);     // output: { brand: 'Samsung', color: 'black' }
        })
        .catch(function (error) {       // oops, mom don't buy it
            console.log(error.message); // output: 'mom is not happy'
        });
};
//askMom();


// ES7 
const isMomHappy = true;
const willIGetNewPhone = new Promise(
    (resolve, reject) => {
        if (isMomHappy) {
            const phone = { brand: 'Samsung', color: 'black' };
            resolve(phone);
        } else {
            const reason = new Error('mom is not happy');
            reject(reason);
        }
    }
);
async function showOff(phone) {
    return new Promise(
        (resolve, reject) => {
            var message = 'Hey friend, I have a new ' + phone.color + ' ' + phone.brand + ' phone';
            resolve(message);
        }
    );
// eslint-disable-next-line no-extra-semi
};
async function askMomES7() {
    try {
        console.log('before asking Mom');
        let phone = await willIGetNewPhone;
        let message = await showOff(phone);
        console.log(message);
        console.log('after asking mom');
    }
    catch (error) {
        console.log(error.message);
    }
}
(async () => {
    await askMomES7();
})();

*/

