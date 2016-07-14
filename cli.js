'use strict';

var path = require('path');
var assert = require('assert');
var pify = require('pify');
var fs = require('fs-extra');
var inject = require('./');

var readFileP = pify(fs.readFile);
var writeFileP = pify(fs.writeFile);

module.exports = function (resourceFile, files) {
  assert(resourceFile, 'Expected a resource file as first argument');
  assert(files && files.length > 0, 'Expected at least one file to inject content into');

  var resourceP = Promise.resolve(require(path.resolve(resourceFile)));
  var readPromises = files.map(function (file) {
    return readFileP(file, 'utf8')
      .then(function (content) {
        return {
          file: file,
          content: content
        };
      });
  });
  return Promise.all(readPromises)
    .then(function (readResults) {
      return resourceP.then(function (resource) {
        return readResults.map(function (result) {
          return writeFileP(result.file, inject(resource, result.content));
        });
      });
    });
};
