var q = function(q) {
	return document.querySelector(q);
};

onload = function() {
	var defaults = JSON.parse(localStorage.getItem('defaults')) || Scalear.defaults,
		neckViewModel = {
			data: Scalear.scales[defaults.scale]
		},
		neckView = new Scalear.Neck(defaults.tunning, defaults.fretCount, defaults.stringCount, defaults.rootNote),
		scaleSelect = new Scalear.ScaleSelect(),
		rootSelect = new Scalear.RootSelect();

	neckView.render(Svg.get('svg'));
	neckView.model = neckViewModel;
	neckView.rootNote = defaults.rootNote || 0;
	neckView.setNoteNamesVisibility(defaults.namesVisible);

	rootSelect.model = Scalear.notes;
	scaleSelect.model = Scalear.scales;

	q('#name').innerHTML = Scalear.scales[defaults.scale].name;
	q('#root').innerHTML = Scalear.notes[defaults.rootNote];
	q('#note-names').checked = defaults.namesVisible;
	q('#root-selector option[value="' + defaults.rootNote + '"]').selected = 'selected';
	q('#scale-selector option[value="' + defaults.scale + '"]').selected = 'selected';
	q('#frets-count').value = defaults.fretCount;

	q('#scale-selector').addEventListener('change', function() {
		defaults.scale = parseInt(this.value, 10);
	});
	q('#root-selector').addEventListener('change', function() {
		defaults.rootNote = parseInt(this.value, 10);
	});
	q('#note-names').addEventListener('change', function() {
		defaults.namesVisible = this.checked;
	});
	q('#frets-count').addEventListener('change', function() {
		defaults.fretCount = parseInt(this.value, 10) || 12;
	});
	Object.observe(defaults, function(changes) {
		changes.forEach(function(change) {
			switch (change.name) {
				case 'rootNote':
					neckView.rootNote = change.object.rootNote;
					q('#root').innerHTML = Scalear.notes[change.object.rootNote];
					break;
				case 'scale':
					neckViewModel.data = Scalear.scales[change.object.scale];
					q('#name').innerHTML = Scalear.scales[change.object.scale].name;
					break;
				case 'namesVisible':
					neckView.setNoteNamesVisibility(change.object.namesVisible);
					break;
				case 'fretCount':
					neckView.updateFretCount(change.object.fretCount);
					break;
			}
		});
		localStorage.defaults = JSON.stringify(defaults);
	});

};