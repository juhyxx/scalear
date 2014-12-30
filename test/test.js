var page = require('webpage').create();

page.onInitialized = function() {
	page.injectJs("./node_modules/es5-shim/es5-shim.js");
};
page.viewportSize = {
	width: 1920,
	height: 1080
};

page.open('http://localhost:8000/#/ukulele-gcea/major-chord/f#/', function(status) {
	console.log('\x1b[36m ', 'Page loading status: ' + status + '\x1b[0m');

	if (status !== 'fail') {
		page.render('screenshots/inital.png');
		var data = page.evaluate(function() {
			return {
				title: document.title,
				header: document.querySelector('h1.title').innerText,
				location: window.location.hash
			};
		});
		assertSame('title', data.title, 'F♯ Major chord (Scalear 0.4.7)');
		assertSame('header', data.header, 'F♯ Major chord');
		assertSame('location', data.location, '#/ukulele-gcea/major-chord/f#/');

		page.evaluate(function() {
			document.querySelector('input#frets-count').value = 24;
			var a = document.querySelector('.two-values-switch');
			var e = document.createEvent('MouseEvents');
			e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);

		});

		var checked = page.evaluate(function() {
			document.querySelector('input#note-names').click();
			return document.querySelector('input#note-names').checked;
		});
		assertSame('input#note-names', checked, false);

		page.render('screenshots/note-names.png');
	}

	phantom.exit();
});

function assertSame(text, value1, value2) {
	if (value1 !== value2) {
		console.log('\x1b[31m failed\x1b[0m', text, '\t"' + value1 + '" is not "' + value2 + '"');
	} else {
		console.log('\x1b[32m OK\x1b[0m', text);
	}
}