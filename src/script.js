onload = function() {
	var stringCount = 6,
		fretCount = 12,
		tunning = [4, 11, 7, 2, 9, 4],
		rootNote = 0,
		neckViewModel = {
			data: Scalear.scales[0]
		},
		neckView = new Scalear.Neck(tunning, fretCount, stringCount, rootNote),
		scaleSelect = new Scalear.ScaleSelect(),
		rootSelect = new Scalear.RootSelect();

	neckView.render(Svg.get('svg'));
	neckView.setNoteNamesVisibility(false);
	neckView.setModel(neckViewModel);
	neckView.setNotesRoot(0);

	rootSelect.setModel(Scalear.notes);
	scaleSelect.setModel(Scalear.scales);

	document.querySelector('#frets-count').value = fretCount;
	document.querySelector('#scale-selector').addEventListener('change', function() {
		var id = parseInt(this.value, 10);
		neckViewModel.data = Scalear.scales[id];
	});
	document.querySelector('#root-selector').addEventListener('change', function() {
		var id = parseInt(this.value, 10);
		neckView.setNotesRoot(id);
		document.querySelector('#root').innerHTML = Scalear.notes[id];
	});
	document.querySelector('#note-names').addEventListener('change', function() {
		neckView.setNoteNamesVisibility(this.checked);
	});
	document.querySelector('#frets-count').addEventListener('change', function() {
		neckView.setFretsCount(this.value);
	});
	Object.observe(neckViewModel, function(changes) {
		document.querySelector('#name').innerHTML = changes[0].object.data.name;
	});
	document.querySelector('#name').innerHTML = Scalear.scales[0].name;
	document.querySelector('#root').innerHTML = Scalear.notes[0];

};