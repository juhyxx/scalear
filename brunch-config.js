module.exports = {
	//optimize: true,
	files: {
		javascripts: {
			joinTo: {
				'vendor.js': /^(?!app)/,
				'scalear.js': /^app/
			}
		},
		stylesheets: {
			joinTo: 'scalear.css'
		},
		templates: {
			joinTo: 'scalear.js'
		}
	},
	plugins: {
		postcss: {
			processors: [
				require('autoprefixer')(['last 2 versions'])
			]
		},
		cssnano: {
			autoprefixer: {
				add: true
			}
		}
	}
};
