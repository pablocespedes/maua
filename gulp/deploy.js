'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var fs = require('fs'),
  argv = require('yargs').argv,
  tasks = fs.readdirSync('./gulp/tasks/');

require('./config');

// --release flag when executing a task
global.release = argv.release;


var tasks= ['clean','index', 'styles', 'images', 'assets', 'templates', 'lint',
      'browserify','minify'];

tasks.forEach(function (task) {
  require('./tasks/' + task);
});


module.exports = gulp.task('deploy', function () {
    runSequence(
      'clean',
      ['index', 'styles', 'images', 'assets', 'templates', 'lint'],
      'browserify',
      ['minify']
    );
});
