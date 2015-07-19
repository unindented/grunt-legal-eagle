'use strict';

var fs = require('fs');

var testExistence = function (test, expectations) {
  test.expect(expectations.length);

  expectations.forEach(function (expectation) {
    test.equal(fs.existsSync(expectation), true, expectation + ' should exist');
  });

  test.done();
};

exports.command = {
  'shallow': function (test) {
    testExistence(test, [
      'test/fixtures/shallow.txt'
    ]);
  },
  'deep': function (test) {
    testExistence(test, [
      'test/fixtures/deep.txt'
    ]);
  },
  'orphan': function (test) {
    testExistence(test, [
      'test/fixtures/orphan.txt'
    ]);
  }
};
