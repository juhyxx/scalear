onload = function() {
	var neckViewModel = {
			data: Scalear.scales[0]
		},
		neckView = new Scalear.Neck(Scalear.defaults.tunning, Scalear.defaults.fretCount, Scalear.defaults.stringCount, Scalear.defaults.rootNote),
		scaleSelect = new Scalear.ScaleSelect(),
		rootSelect = new Scalear.RootSelect();

	neckView.render(Svg.get('svg'));
	neckView.setNoteNamesVisibility(false);
	neckView.model = neckViewModel;
	neckView.rootNote = Scalear.defaults.rootNote;

	rootSelect.model = Scalear.notes;
	scaleSelect.model = Scalear.scales;

	//document.querySelector('#frets-count').value = Scalear.defaults.fretCount;
	document.querySelector('#scale-selector').addEventListener('change', function() {
		var id = parseInt(this.value, 10);
		neckViewModel.data = Scalear.scales[id];
	});
	document.querySelector('#root-selector').addEventListener('change', function() {
		var id = parseInt(this.value, 10);
		neckView.rootNote = id;
		document.querySelector('#root').innerHTML = Scalear.notes[id];
	});
	document.querySelector('#note-names').addEventListener('change', function() {
		neckView.setNoteNamesVisibility(this.checked);
	});
	/*document.querySelector('#frets-count').addEventListener('change', function() {
		neckView.fretCount = this.value;
	});*/
	Object.observe(neckViewModel, function(changes) {
		document.querySelector('#name').innerHTML = changes[0].object.data.name;
	});
	document.querySelector('#name').innerHTML = Scalear.scales[0].name;
	document.querySelector('#root').innerHTML = Scalear.notes[0];

};