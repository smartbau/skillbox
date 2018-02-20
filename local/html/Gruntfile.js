module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            js: {
                src: [
                    'dev/js/lib/*.js',
                    'dev/js/*.js'
                ],
                dest: 'dev/application.js'
            },
            css: {
                src: [
                    'dev/scss/lib/mixin.scss',
                    'dev/scss/lib/sprite.scss',
                    'dev/scss/lib/*.scss',
                    'dev/scss/main.scss',
                    'dev/scss/*.scss',
                ],
                dest: 'dev/application.scss'
            }
        },
        sass: {
            dist: {
                files: {
                    'css/application.css': '<%= concat.css.dest %>',
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'css/application.css': ['css/application.css']
                }
            }
        },
        uglify: {
            main: {
                files: {
                    'js/application.min.js': '<%= concat.js.dest %>'
                }
            }
        },
        watch: {
            main: {
                files: 'dev/js/**/*',
                tasks: ['concat:js', 'uglify']
            },
            css: {
                files: 'dev/scss/**/*',
                tasks: ['concat:css', 'sass', 'cssmin']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '*.html',
                        '*.js',
                        '*.css',
                        'css/*.css',
                        'js/*.js',
                    ]
                },
                options: {
                    server: {
                        basedir: './',
                    },
                    watchTask: true,
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['browserSync', 'watch']);
};
