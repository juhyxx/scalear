module.exports = {
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
		sass: {}
	}
};
