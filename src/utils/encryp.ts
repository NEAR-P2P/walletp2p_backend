const CryptoJS = require('crypto-js');

const key: string | undefined = process.env.CLAVE;

function encryp(data: string){
  return CryptoJS.AES.encrypt(data, key).toString();
}

function decryp(data: string){
  var wA= CryptoJS.AES.decrypt(data, key);
  return wA.toString(CryptoJS.enc.Utf8);
}


export default {
  encryp,
  decryp
}