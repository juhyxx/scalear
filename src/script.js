onload = function() {
	var stringCount = 6,
		fretCount = 12,
		tunning = [4, 11, 7, 2, 9, 4],
		scales = [{
			name: "Aeolioan",
			notes: [0, 2, 4, 5, 7, 9, 11]
		}, {
			name: "Dorian",
			notes: [2, 4, 5, 7, 9, 11, 0]
		}, {
			name: "Pentat",
			notes: [0, 2, 4, 7, 9]
		}],
		neckView = new Scalear.Neck(tunning, fretCount, stringCount),
		model = new Mvc.Model();

	neckView.on('update', function(data) {
		neckView.showScale(data);
	}, this);
	neckView.render(Svg.get('svg'));
	model.setData(scales[1].notes);

	document.querySelector('select').addEventListener('change', function() {
		var id = parseInt(document.querySelector('select').value, 10);
		model.setData(scales[id].notes);
	});
};