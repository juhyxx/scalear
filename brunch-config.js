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
		babel: {
			presets: [['env', {
			  targets: {
				browsers:[ ">4%", "not ie 11", "not op_mini all"]
			  }
			}]]
		  },
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
