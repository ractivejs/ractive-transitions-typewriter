module.exports = function ( grunt ) {

	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		jshint: {
			main: 'src/**/*.js',
			options: {
				strict: true,
				unused: true,
				undef: true,
				smarttabs: true,
				globals: {
					define: true,
					module: true,
					require: true,
					window: true,
					document: true,
					setTimeout: true,
					setInterval: true,
					clearInterval: true
				}
			}
		},

		concat: {
			bundle: {
				src: 'src/Ractive-transitions-typewriter.js',
				dest: 'tmp/Ractive-transitions-typewriter.js'
			},
			options: {
				process: {
					data: {
						VERSION: '<%= pkg.version %>'
					}
				}
			}
		},

		qunit: {
			files: [ 'test/index.html' ]
		},

		uglify: {
			bundle: {
				src: 'tmp/Ractive-transitions-typewriter.js',
				dest: 'tmp/Ractive-transitions-typewriter.min.js'
			}
		},

		copy: {
			bundle: {
				files: [{
					cwd: 'tmp/',
					src: '*.js',
					dest: '',
					expand: true
				}]
			}
		}
		
	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );

	grunt.registerTask( 'default', [
		'jshint',
		'concat',
		'qunit',
		'uglify',
		'copy'
	]);

};