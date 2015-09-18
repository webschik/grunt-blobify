# grunt-blobify [![Build Status](https://secure.travis-ci.org/webschik/grunt-blobify.png?branch=master)](https://travis-ci.org/webschik/grunt-blobify)
Grunt task to convert any files to Blob for usage in browser

## Getting Started
This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-blobify --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-blobify');
```

## Blobify task
### options
#### target
Type: `String`. Values: `es6`, `global`. Default: `es6`.  
Compiles result of task as:
    * `es6` - `export default {...};`
    * `global` - `window.files = {};`

#### targetNamespace
Type: `String`. Default: `window`. Namespace for `global` target.

## Examples
### `global` target
````js
blobify: {
    main: {
        options: {
            target: 'global',
            targetNamespace: 'myApp.cache'
        },
        src: [
            '/YOUR_PATH/*.png',
            '/YOUR_PATH2/*.docx'
        ],
        dest: 'YOUR_PATH/filesCache.js'
    }
}
````
After running `grunt blobify:main` we will have in 'YOUR_PATH/filesCache.js':
````js
....
myApp.cache.files = {
    '/YOUR_PATH/*.png': {Blob},
    '/YOUR_PATH2/*.docx': {Blob}
};
````
### `ES6` target
````js
blobify: {
    main: {
        options: {
            target: 'es6' //or you may remove options, target has 'es6' value by default
        },
        src: [
            '/YOUR_PATH/*.png',
            '/YOUR_PATH2/*.docx'
        ],
        dest: 'YOUR_PATH/filesCache.js'
    }
}
````
After running `grunt blobify:main` we will have in 'YOUR_PATH/filesCache.js':
````js
....
var files = {
    '/YOUR_PATH/*.png': {Blob},
    '/YOUR_PATH2/*.docx': {Blob}
};
....
exports default files;
````
