// Generated on 2014-05-08 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      src: require('./bower.json').srcPath || 'src',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= yeoman.src %>/app/**/*.js','<%= yeoman.src %>/app/**/*.html'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.src %>/**/*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.src %>/{,*/}*.html',
          '<%= yeoman.src %>/app/**/*.tpl.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.src %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.src %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.src %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.src %>/app/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.src %>/index.html'],
        ignorePath: '<%= yeoman.src %>/'
      },
      sass: {
        src: ['<%= yeoman.src %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: '<%= yeoman.src %>/bower_components/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.src %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.src %>/images',
        javascriptsDir: '<%= yeoman.src %>/app',
        fontsDir: '<%= yeoman.src %>/styles/fonts',
        importPath: '<%= yeoman.src %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/app/{,*/}*.js',
            '<%= yeoman.dist %>/app/**/*.js',
            '<%= yeoman.dist %>/common/**/*.js',
            '<%= yeoman.dist %>/scripts/*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.src %>/index.html',
      js: '<%= yeoman.src %>/app/**/*.js',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
        html: ['<%= yeoman.dist %>/{,*/}*.html','<%= yeoman.dist %>/app/**/*.html'],
        css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
        js: [
          '<%= yeoman.dist %>/app/**/*.js',
          '<%= yeoman.dist %>/common/*.js',
          '<%= yeoman.dist %>/templates/*.html',
          '<%= yeoman.dist %>/index.html'],
        options: {
            assetsDirs: ['<%= yeoman.dist %>'        ,
                '<%= yeoman.dist %>/app/account',
                '<%= yeoman.dist %>/app/home',
                '<%= yeoman.dist %>/app/home/dashboard/',
                '<%= yeoman.dist %>/app/home/track-dashboard',
                '<%= yeoman.dist %>/app/practiceGame/common',
                '<%= yeoman.dist %>/app/practiceGame/custom-practice',
                '<%= yeoman.dist %>/app/practiceGame/question',
                '<%= yeoman.dist %>/app/practiceGame',
                '<%= yeoman.dist %>/common/restAngular',
                '<%= yeoman.dist %>/common/directives',
                '<%= yeoman.dist %>/common/services',
                '<%= yeoman.dist %>/common/filters',
              '<%= yeoman.dist %>/common/constants',
                '<%= yeoman.dist %>/app',
                '<%= yeoman.dist %>/common',
                '<%= yeoman.dist %>/common/lib'
            ],
            patterns: {

                js: [
                    [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images'],
                    /*Change references for account */
                    [/(application.ctrl\.js)/, 'Replacing references to account ctrl'],
                    [/(account.module\.js)/, 'Replacing references account to module'],
                    /*Change references for home controllers and services*/
                    [/(sDashboard.ctrl\.js)/, 'Replacing references to home ctrl'],
                    [/(sDashboard.service\.js)/, 'Replacing references to home service'],
                    [/(home.module\.js)/, 'Replacing references to home module'],
                    /*Change references for practice controllers and services*/
                    [/(dashboard.ctrl\.js)/, 'Replacing references to dashboard ctrl'],
                    [/(dashboard.service\.js)/, 'Replacing references to dashboard service'],
                    [/(customPractice.ctrl\.js)/, 'Replacing references to practice ctrl'],
                    [/(question.ctrl\.js)/, 'Replacing references to question directive'],

                    [/(practice.directive\.js)/, 'Replacing references to practice directive'],
                    [/(practice.service\.js)/, 'Replacing references to practice service'],
                    [/(practiceGame.module\.js)/, 'Replacing references to practice module'],

                    [/(restAngular.module\.js)/, 'Replacing references to restAngular module'],
                    [/(restAngular.service\.js)/, 'Replacing references to restAngular service'],

                    [/(general.directive\.js)/, 'Replacing references to general directives'],
                    [/(application.services\.js)/, 'Replacing references to general services'],

                    [/(auth.services\.js)/, 'Replacing references to auth services'],

                    [/(application.filters\.js)/, 'Replacing references to application filters'],

                   [/(application.constants\.js)/, 'Replacing references to application constants'],

                    [/(analytic.service\.js)/, 'Replacing references to Analytic services'],

                    [/(jquery.grockit\.js)/, 'Replacing references to practice module'],

                    [/(app\.js)/, 'Replacing references to app'],



                    [/(underscore\.js)/, 'Replacing references to underscore ']
                ]
            }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
        dist: {
            options: {
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true
            },
            files: [{
                expand: true,
                cwd: '<%= yeoman.src %>',
                src: ['styles/**/*.css'],
                dest: '<%= yeoman.dist %>'
            }]
        }
    },
      uglify: {
          options: {
              mangle: false, //prevents all the variables to be changed for any reason
              compress: {
                  drop_console: true // <-
              }
          },
          dist: {
              files: [{
                  expand: true,
                  cwd: '<%= yeoman.dist %>',
                  src:[],
                 // src: ['app/**/*.js','common/**/*.js'],
                  dest: '<%= yeoman.dist %>'
              }]
          }
      },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.src %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.src %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.src %>',
          src: ['/*.html', '/app/**/*.html', '/app/*.html' ],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.src %>',
          dest: '<%= yeoman.dist %>',
          src: [
              'app/**/*',
              'assets/**/*',
              'common/**/*',
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.src %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.src %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
