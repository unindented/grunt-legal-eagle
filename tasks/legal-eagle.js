'use strict';

var _ = require('lodash');
var async = require('async');
var fs = require('fs-extra');
var legalEagle = require('legal-eagle');
var path = require('path');

var verifyOptions = function (options, callback) {
  fs.lstat(options.src, function (err, stats) {
    callback(!(stats && stats.isDirectory()) &&
      new Error('Option `src` does not point to a directory'));
  });
};

var extractLicenses = function (options, callback) {
  var legalOptions = {
    path: options.src,
    overrides: options.overrides
  };

  legalEagle(legalOptions, function (err, licenses) {
    callback(err && new Error('Error extracting licenses: ' + err.message), licenses);
  });
};

var massageLicenses = function (options, licenses, callback) {
  var error = null;

  var pkg = fs.readJsonSync(path.join(options.src, 'package.json'), {throws: false}) || {};
  var key = pkg.name + '@' + pkg.version;

  var root = licenses[key];
  var dependencies = _.map(_.omit(licenses, key), function (license, name) {
    license = options.omitSourceText ? _.omit(license, 'sourceText') : license;
    return _.assign({name: name}, license);
  });

  var unknownDependencies = _.filter(dependencies, function (dependency) {
    return !dependency.license ||
      dependency.license === 'UNKNOWN';
  });
  var unsafeDependencies = _.filter(dependencies, function (dependency) {
    return dependency.license &&
      dependency.license !== 'UNKNOWN' &&
      !_.contains(options.safeLicenses, dependency.license);
  });

  if (options.failOnUnknown && unknownDependencies.length > 0) {
    error = new Error('Unknown license for dependencies: ' +
      _.pluck(unknownDependencies, 'name').join(', '));
  }

  if (options.failOnUnsafe && unsafeDependencies.length > 0) {
    error = new Error('Unsafe license for dependencies: ' +
      _.pluck(unsafeDependencies, 'name').join(', '));
  }

  if (options.omitSafe) {
    dependencies = _.union(unknownDependencies, unsafeDependencies);
  }

  callback(error, {
    root: root,
    dependencies: _.sortBy(dependencies, 'name')
  });
};

var generateSummary = function (options, licenses, callback) {
  async.waterfall([
    async.apply(fs.readFile, options.template),
    function (template, callback) {
      try {
        callback(null, _.template(template)(licenses));
      }
      catch (err) {
        callback(err);
      }
    }
  ], function (err, summary) {
    callback(err && new Error('Error generating summary: ' + err.message), summary);
  });
};

/******************************************************************************/

module.exports = function (grunt) {
  grunt.registerMultiTask('legal-eagle', 'Generate a LICENSE file with all the licenses for your dependencies.', function () {
    var done = this.async();

    var options = this.options({
      safeLicenses: [
        'Apache',
        'BSD',
        'CC-BY',
        'ISC',
        'MIT',
        'Unlicense',
        'WTF'
      ],

      overrides: {},

      failOnUnknown: true,
      failOnUnsafe: true,

      omitSafe: false,
      omitSourceText: false,

      template: path.join(__dirname, '../resources/template.ejs')
    });

    options.src = this.data.src;
    options.dest = this.data.dest;

    async.waterfall([
      async.apply(verifyOptions, options),
      async.apply(extractLicenses, options),
      async.apply(massageLicenses, options),
      async.apply(generateSummary, options),
      async.apply(fs.outputFile, options.dest)
    ], function (err) {
      if (!err) {
        grunt.log.ok('Successfully created license file ' + options.dest);
      }

      done(err);
    });
  });
};
