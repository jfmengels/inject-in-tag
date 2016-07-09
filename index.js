'use strict';

function injectSingle(tag, newContent, previousContent) {
  var tagToLookFor = '<!-- ' + tag + ':';
  var closingTag = '-->';
  var startOfOpeningTagIndex = previousContent.indexOf(tagToLookFor + 'START');
  var endOfOpeningTagIndex = previousContent.indexOf(closingTag, startOfOpeningTagIndex);
  var startOfClosingTagIndex = previousContent.indexOf(tagToLookFor + 'END', endOfOpeningTagIndex);
  if (startOfOpeningTagIndex === -1 || endOfOpeningTagIndex === -1 || startOfClosingTagIndex === -1) {
    return previousContent;
  }
  return previousContent.slice(0, endOfOpeningTagIndex + closingTag.length) +
    newContent +
    previousContent.slice(startOfClosingTagIndex);
}

module.exports = function inject(newContent, previousContent) {
  return Object.keys(newContent)
    .reduce(function (res, tag) {
      return injectSingle(tag, newContent[tag], res);
    }, previousContent);
};
