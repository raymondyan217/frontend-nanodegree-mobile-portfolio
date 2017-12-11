'use strict'

var ngrok = require('ngrok');

const imageminOptipng = require('imagemin-optipng');
const imageminJpegtran = require('imagemin-jpegtran');

module.exports = function(grunt) {

  // Load grunt tasks
  require('load-grunt-tasks')(grunt);

  // Grunt configuration
  grunt.initConfig({
    imagemin: {
        static: {
            options: {
                optimizationLevel: 3,
                svgoPlugins: [{removeViewBox: false}],
                use: [imageminJpegtran(), imageminOptipng()] // Example plugin usage
            },
            files: {
              'dist/images/pizzeria.jpg': 'dist/images/pizzeria.jpg',
              'dist/images/pizza.png': 'views/images/pizza.png',
              'dist/images/profilepic.jpg': 'img/profilepic.jpg'
            }
        }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/css/output.css': ['css/print.css', 'css/style.css']
        }
      }
    },
    image_resize: {
      resize: {
        options: {
          width: 360,
          height: 270
        },
        files: {
          'dist/images/pizzeria.jpg': 'views/images/pizzeria.jpg'
        }
      }
    },
    uglify: {
      my_target: {
        files: {
          'dist/js/perfmatters.js': ['js/perfmatters.js'],
          'dist/js/main.js': ['views/js/main.js'],
        }
      }
    },
    pagespeed: {
      options: {
        nokey: true,
        locale: "en_G",
        threshold: 40
      },
      local: {
        options: {
          strategy: "desktop"
        }
      },
      mobile: {
        options: {
          strategy: "mobile"
        }
      }
    }
  });

  // Register customer task for ngrok
  grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
    var done = this.async();
    var port = 8081;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set('pagespeed.options.url', url);
      grunt.task.run('pagespeed');
      done();
    });
  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Register default tasks
  grunt.registerTask('default', ['cssmin', 'image_resize', 'imagemin', 'uglify', 'psi-ngrok'  ]);
};
