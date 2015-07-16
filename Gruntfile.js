var path = require('path');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        config: {
            dist: 'dist'
        },
        clean: {
            options: {
                force: true,
            },
            build: ['<%= config.dist %>/**/*.*']
        },
        express: {
            dev: {
                options: {
                    server: path.resolve('./server'),
                    port: 3000,
                    hostname: '*'
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true
            }
        },
        cssmin: {
            options: {
                sourceMap: true
            }
        },
        requirejs: {
            options: {
                paths: {
                    'appFiles': './app'
                },
                removeCombined: true,
                out: './app/requirejs/appIdeas-combined.js',
                optimize: 'none',
                name: 'main'
            },
            dev: {
                options: {
                    optimize: 'none'
                }
            },
            release: {
                options: {
                    optimize: 'uglify'
                }
            }
        },
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'dist'
            }
        },
        concat: {
            options: {
                separator: '\n;',
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            sourcemaps: {
                src: ['<%= config.dist %>/*.map.css', '<%= config.dist %>/*.map.js'],
            },
            assets: {
                src: ['<%= config.dist %>/*.css', '<%= config.dist %>/*.js', '<%= config.dist %>/images/**/*.{jpg,png}', '!dist/styles/*.map.css', '!dist/*.map.js'],
            },
        },
        userev: {
            options: {
                hash: /(\.[a-f0-9]{8})\.[a-z]+$/,
            },
            assets: {
                src: ['<%= config.dist %>/*.css', '<%= config.dist %>/*.js', '<%= config.dist %>/images/**/*.{jpg,png}', '!dist/styles/*.map.css', '!dist/*.map.js'],
                options: {
                    patterns: {
                        'Linking versioned source maps': /sourceMappingURL=([a-z0-9.]*\.map)/,
                    },
                },
            },
            index: {
                src: '<%= config.dist %>/index.html'
            },
        },
        usemin: {
            html: ['<%= config.dist %>/index.html']
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['./index.html', 'images/**', 'views/**'],
                    dest: '<%= config.dist %>/'
                }],
            },
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: 'dist',
                src: ['**/*.html'],
                dest: '<%= config.dist %>/'
            },
        },
    });

    grunt.registerTask('minify', [
        'clean',
        'copy',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',

        'filerev:sourcemaps',
        'userev:assets',
        'filerev:assets',
        'userev:index',

        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('dev', [
        'requirejs:dev',
        'minify',
        'express:dev',
        'express-keepalive'
    ]);

    grunt.registerTask('release', [
        'requirejs:release',
        'minify',
        'express:dev',
        'express-keepalive'
    ]);
};