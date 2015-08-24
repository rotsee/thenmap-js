module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      build: {
        src: 'src/thenmap.js',
        dest: 'build/thenmap-<%= pkg.version %>.min.js'
      }
    },
    copy: {
      main: {
        src: 'src/thenmap.js',
        dest: 'build/thenmap-<%= pkg.version %>.js'
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'copy']);

};