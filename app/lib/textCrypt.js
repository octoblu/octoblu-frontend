var crypto = require('crypto');
var cryptkey = crypto.createHash('sha256').update(process.env.TEXT_CRYPT_KEY || 'notsecure').digest();
var iv = new Buffer(process.env.TEXT_CRYPT_NONCE || 'thisisanoncense1');

var AESCrypt = {};

AESCrypt.decrypt = function(encryptdata) {
  var decypher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv);
  var decyphered = decypher.update(encryptdata, 'hex', 'utf8');
  decyphered += decypher.final('utf8');
  return decyphered;
}

AESCrypt.encrypt = function(cleardata) {
  var encypher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv);
  var encyphered = encypher.update(cleardata, 'utf8');
  encyphered += encypher.final('hex');
  return encyphered
}

module.exports = AESCrypt;
