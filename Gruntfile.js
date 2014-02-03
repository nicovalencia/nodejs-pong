module.exports = function(grunt) {

  var config = {};

  config.pkg = grunt.file.readJSON('package.json');

  // Browserify
  grunt.loadNpmTasks('grunt-browserify');
  config.browserify = {
    files: {
      src: ['client/main.js'],
      dest: 'public/main.js'
    },
    options: {
      shim: {
        underscore: {
          path: 'bower_components/underscore/underscore.js',
          exports: '_'
        },
        THREE: {
          path: 'bower_components/three.js/three.min.js',
          exports: 'THREE'
        }
      },
      aliasMappings: [
        { cwd: 'client/lib', src: '**/*.js', dest: 'lib' },
        { cwd: 'client/support', src: '**/*.js', dest: 'support' }
      ]
    }
  };

  // Watch
  grunt.loadNpmTasks('grunt-contrib-watch');
  config.watch = {
    scripts: {
      files: ['client/**'],
      tasks: ['browserify']
    }
  };

  grunt.initConfig(config);
  grunt.registerTask('default', ['browserify', 'watch']);

};

