# grunt-legal-eagle [![Version](https://img.shields.io/npm/v/grunt-legal-eagle.svg)](https://www.npmjs.com/package/grunt-legal-eagle) [![Build Status](https://img.shields.io/travis/unindented/grunt-legal-eagle.svg)](http://travis-ci.org/unindented/grunt-legal-eagle) [![Dependency Status](https://img.shields.io/gemnasium/unindented/grunt-legal-eagle.svg)](https://gemnasium.com/unindented/grunt-legal-eagle)

> Generate a `LICENSE` file with all the licenses for your dependencies, extracted using [`legal-eagle`](https://github.com/atom/legal-eagle).


## Getting Started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-legal-eagle --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-legal-eagle');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-copy/tree/grunt-0.3-stable).*


## Legal Eagle task

_Run this task with the `grunt legal-eagle` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Usage

To generate a `LICENSE` file starting from a particular directory:

```js
'legal-eagle': {
  app: {
    src: 'path/to/app/'
    dest: 'path/to/dist/LICENSE'
  }
}
```

You can also provide overrides for certain dependencies:

```js
'legal-eagle': {
  options: {
    overrides: {
      'aws-sign@0.3.0': {
        repository: 'https://github.com/mikeal/aws-sign',
        license: 'MIT',
        source: 'index.js'
      }
    }
  },
  baz: {
    src: 'path/to/baz/'
    dest: 'path/to/dist/LICENSE-BAZ'
  },
  qux: {
    src: 'path/to/qux/'
    dest: 'path/to/dist/LICENSE-QUX'
  }
}
```

### Options

#### src
Type: `String`

Path to the folder that needs to be scanned.

#### dest
Type: `String`

Path to the file that will be written with the summary.

#### options.safeLicenses
Type: `Array[String]`
Default: `['Apache', 'BSD', 'CC-BY', 'ISC', 'MIT', 'Unlicense', 'WTF']`

List of licenses that are considered *safe* for your project.

#### options.failOnUnknown
Type: `Boolean`
Default: `true`

Fail the build if there are dependencies with an unknown license.

#### options.failOnUnsafe
Type: `Boolean`
Default: `true`

Fail the build if there are dependencies with an *unsafe* license (not listed in `safeLicenses`).

#### options.omitSafe
Type: `Boolean`
Default: `false`

Omit *safe* licenses in the summary, showing only unknown and unsafe ones.

#### options.omitSourceText
Type: `Boolean`
Default: `false`

Omit license source text in the summary.

#### options.overrides
Type: `Object`
Default: `{}`

If you know the license of a given dependency but `legal-eagle` can't automatically determine it, pass an `overrides` hash with its `name@version` as the key, and the `license`, `source` and `sourceText` you want to use in the summary.


## Meta

* Code: `git clone git://github.com/unindented/grunt-legal-eagle.git`
* Home: <https://github.com/unindented/grunt-legal-eagle/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2015 Daniel Perez Alvarez ([unindented.org](https://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
