module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    'clean': {
      test: [
        'test/fixtures/*.txt'
      ]
    },

    'jshint': {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    'legal-eagle': {
      options: {
        safeLicenses: ['BSD', 'LGPL', 'MIT']
      },
      shallow: {
        src: 'test/fixtures/shallow',
        dest: 'test/fixtures/shallow.txt'
      },
      deep: {
        options: {
          overrides: {
            'bsd3@0.0.1': {
              license: 'BSD'
            }
          }
        },
        src: 'test/fixtures/deep',
        dest: 'test/fixtures/deep.txt'
      },
      orphan: {
        options: {
          omitSourceText: true
        },
        src: 'test/fixtures/orphan',
        dest: 'test/fixtures/orphan.txt'
      }
    },

    'nodeunit': {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first lint everything, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'jshint', 'legal-eagle', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);
};
