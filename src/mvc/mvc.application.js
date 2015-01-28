Mvc.Application = function() {};

Mvc.Application.prototype = Object.create({}, {
	model: {
		get: function() {
			return this._model;
		},
		set: function(model) {
			var self = this;

			this._model = model;
			Object.observe(this._model, function(changes) {
				self.modelUpdate(self._model, changes);
			});
		}
	},
	route: {
		get: function() {
			var params = (location.hash.slice(1) || '/').split('/');

			params.shift();
			params.pop();
			return params || [];
		},
		set: function(route) {
			window.location.hash = route;
		}
	}
});

Mvc.Application.prototype.run = function() {
	window.addEventListener('load', function onload() {
		window.removeEventListener("load", onload, false);
		this.onBoot.call(this);
	}.bind(this));

	window.addEventListener('hashchange', function() {
		this.onRouteChange(this.route);
	}.bind(this));

	document.addEventListener("fullscreenchange", function(event) {
		document.documentElement.classList[document.fullscreenEnabled ? 'add' : 'remove']("fullscreen");
	});
};

Mvc.Application.prototype.showFullScreen = function() {
	document.documentElement.requestFullscreen();
};

Mvc.Application.prototype.hideFullScreen = function() {
	document.exitFullscreen();
};

/* start-debug-only */
Mvc.Application.prototype.onRouteChange = function() {
	console.warn('Virtual method "boot", has to be implemented.');
};

Mvc.Application.prototype.onBoot = function() {
	console.warn('Virtual method "boot", has to be implemented.');
};

Mvc.Application.prototype.modelUpdate = function() {
	console.warn('Virtual method "modelUpdate", has to be implemented.');
};
/* end-debug-only*/