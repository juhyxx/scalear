var soda = require('soda');

var browser = soda.createClient({
	host: 'localhost',
	port: 4444,
	url: 'http://localhost:8000/',
	browser: 'googlechrome'
});

browser
	.chain
	.session()
	.setTimeout(5000)
	.open('/')
	.waitForPageToLoad(10000)
	.assertTitle('C Ionian (Scalear 0.4.7)')
	.assertAttribute('css=svg g.labels@style', 'opacity: 1;')
	.click('css=input#note-names')
	.click('css=.two-values-switch')
	.select('css=select#scale-selector', 'label=Chromatic')
	.select('css=select#instrument-selector', 'label=Fretless (Bass)')
	.select('css=select#root-selector', 'C♯')
	.setTimeout(5000)
	.assertTitle('C♯ Chromatic (Scalear 0.4.7)')
	.assertAttribute('css=svg g.labels@style', 'opacity: 0;')
	.assertLocation('http://localhost:8000/#/fretless-bass/chromatic/c#/')
	.testComplete()
	.end(function(err) {
		if (err) throw err;
		console.log('Passed!');
	});