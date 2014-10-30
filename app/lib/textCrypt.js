var crypto = require('crypto');
var cryptkey = crypto.createHash('sha256').update(process.env.TEXT_CRYPT_KEY || 'notsecure').digest();
var iv = new Buffer(process.env.TEXT_CRYPT_NONCE || 'thisisanoncense1');

var AESCrypt = {};

AESCrypt.decrypt = function(encryptdata) {
  var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv);
  decipher.update(encryptdata, 'hex');
  return decipher.final('utf8');
}

AESCrypt.encrypt = function(cleardata) {
  var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv);
  encipher.update(cleardata, 'utf8');
  return encipher.final('hex');
}

module.exports = AESCrypt;
