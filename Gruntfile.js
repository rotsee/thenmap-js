module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: ['src/thenmap.js', 'js/tabletop.js'],
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

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'copy']);

};