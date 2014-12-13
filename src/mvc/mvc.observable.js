Mvc.Observable = {
	_registredEvents: [],

	fire: function(eventName) {
		var args = Array.apply(null, arguments);
		args.shift();

		if (this._registredEvents[eventName]) {
			this._registredEvents[eventName].map(function(ev) {
				ev.handler.apply(ev.scope, args);
			});
		}
	},

	on: function(eventName, fn, scope) {
		this._registredEvents[eventName] = this._registredEvents[eventName] || [];

		this._registredEvents[eventName].push({
			handler: fn,
			scope: scope
		});
	}
};