module.exports = {
	//optimize: true,
	files: {
		
		stylesheets: {
			joinTo: 'scalear.css'
		},
		
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
