Mvc.Model = function() {
	return this;
};
Mvc.Model.prototype = Mvc.Observable;
Mvc.Model.prototype.setData = function(data) {
	this._data = data;
	this.fire('update', data);
};