module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    str2js: {
      CSS: { 'src/styles.js': ['src/styles.css']}
    },

    includereplace: {
      dist: {
        src: 'src/thenmap.js',
        dest: 'src/thenmap.tmp.js'
      }
    },

    concat: {
      dist: {
        src: ['src/thenmap.tmp.js', 'js/tabletop.js'],
        dest: 'src/thenmap.tmp.js',
      }
    },

    uglify: {
      build: {
        src: 'src/thenmap.tmp.js',
        dest: 'build/thenmap-<%= pkg.version %>.min.js'
      }
    },

    copy: {
      main: {
        src: 'src/thenmap.tmp.js',
        dest: 'build/thenmap-<%= pkg.version %>.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-string-to-js');

  // Default task(s).
  grunt.registerTask('default', ['str2js', 'includereplace', 'concat', 'uglify', 'copy']);

};