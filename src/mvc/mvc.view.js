Mvc.View = function() {};
Mvc.View.prototype = Mvc.Observable;
Mvc.View.prototype.render = function() {
	console.warn('virtual method "render", has to be implemented');
};