onload = function() {
	var stringCount = 6,
		fretCount = 12,
		tunning = [4, 11, 7, 2, 9, 4],
		neckViewModel = {
			data: Scalear.scales[0]
		},
		neckView = new Scalear.Neck(tunning, fretCount, stringCount),
		scaleSelect = new Scalear.ScaleSelect();

	neckView.render(Svg.get('svg'));
	neckView.setNoteNamesVisibility(false);
	neckView.setModel(neckViewModel);
	scaleSelect.setModel(Scalear.scales);

	document.querySelector('#frets-count').value = fretCount;
	document.querySelector('#scale-selector').addEventListener('change', function() {
		var id = parseInt(this.value, 10);
		neckViewModel.data = Scalear.scales[id];
	});
	document.querySelector('#note-names').addEventListener('change', function() {
		console.log(document.querySelector('#note-names').value);
		neckView.setNoteNamesVisibility(this.checked);
	});
	document.querySelector('#frets-count').addEventListener('change', function() {
		neckView.setFretsCount(this.value);
	});
};