var chalk = require('chalk');
var mime = require('mime');
var convertFnBody = createBlob.toString();
mime.default_type = null;

function createBlob(src, contentType) {
    var data = JSON.parse(src).data;
    var len = data.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    view.set(data);

    return new Blob([view], {type: contentType});
}

module.exports = function (grunt) {
    grunt.registerMultiTask('blobify', 'Convert files', function () {
        var options = this.options({
            target: 'es6',
            targetNamespace: 'window'
        });

        this.files.forEach(function (f) {
            var src = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file ' + chalk.cyan(filepath) + ' not found.');
                    return false;
                }

                return true;
            });

            if (src.length === 0) {
                grunt.log.warn('Destination ' + chalk.cyan(f.dest) + ' not written because src files were empty.');
                return;
            }

            var output = convertFnBody + '\nvar files = {};\n';
            var filesSrc = '';
            src.forEach(function (filepath) {
                /**
                 * @description With encoding == null it returns a Buffer
                 */
                var buffer = grunt.file.read(filepath, {
                    encoding: null
                });
                var contentType = mime.lookup(filepath);

                if (!contentType) {
                    grunt.log.warn('Unknown contentType ' + chalk.cyan(filepath));
                    return false;
                }

                filesSrc += 'files[\'' + filepath + '\'] = createBlob(\'' + JSON.stringify(buffer) + '\', "' + contentType + '");\n';
            });

            if (!filesSrc) {
                grunt.log.warn('No files are converted');
                return false;
            }

            output += filesSrc;

            switch (options.target) {
                case 'es6':
                    output += '\nexport default files;';
                    break;
                case 'global':
                    output = '(function (root) {\n' +
                    output + '\nroot.files = files;\n}(' + (options.targetNamespace).replace(/\.+$/, '') + '));';
                    break;
            }

            // Write the destination file.
            grunt.file.write(f.dest, output);

            // Print a success message.
            grunt.log.writeln('File ' + chalk.cyan(f.dest) + ' created.');
        });
    });
};