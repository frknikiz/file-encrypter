var crypto = require('crypto'),
    fs = require('fs');

var Encryptor = {};

Encryptor.encryptFile = function(inputPath, outputPath, key, options, callback) {

  if(typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = Encryptor.combineOptions(options);

  var keyBuf = new Buffer(key);

  var stat = fs.statSync(inputPath);
  var inputStream = fs.createReadStream(inputPath);
  var outputStream = fs.createWriteStream(outputPath);
  var cipher = crypto.createCipher(options.algorithm, keyBuf);

  var a=Math.round(stat.size/65536);
      a=80/a;
  var count=0;

  inputStream.on('data', function(data,b) {
    var buf = new Buffer(cipher.update(data), 'binary');
    outputStream.write(buf);
      count+=a;
      callback(count);
  });

  inputStream.on('end', function() {
    var buf = new Buffer(cipher.final('binary'), 'binary');
    
    outputStream.write(buf);
    outputStream.end();
    outputStream.on('close', function() {
      callback();
    });
  });
};

Encryptor.decryptFile = function(inputPath, outputPath, key, options, callback) {

  if(typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = Encryptor.combineOptions(options);

  var keyBuf = new Buffer(key);

  var stat = fs.statSync(inputPath);
  var inputStream = fs.createReadStream(inputPath);
  var outputStream = fs.createWriteStream(outputPath);
  var cipher = crypto.createDecipher(options.algorithm, keyBuf);
    var a=Math.round(stat.size/65536);
    a=80/a;
    var count=0;

  inputStream.on('data', function(data) {
    var buf = new Buffer(cipher.update(data), 'binary');
    outputStream.write(buf);
      count+=a;
      callback(count);
  });

  inputStream.on('end', function() {
    var buf = new Buffer(cipher.final('binary'), 'binary');
    outputStream.write(buf);
    outputStream.end();
  });
};

Encryptor.combineOptions = function(options) {
  var result = {};
  for(var key in Encryptor.defaultOptions) {
    result[key] = Encryptor.defaultOptions[key];
  }

  for(var key in options) {
    result[key] = options[key];
  }

  return result;
};

Encryptor.defaultOptions = {
  algorithm: 'aes256'
};

module.exports = Encryptor;

