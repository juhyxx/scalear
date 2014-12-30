var soda = require('soda');

var browser = soda.createClient({
	host: 'localhost',
	port: 4444,
	url: 'http://localhost:8000/',
	browser: 'googlechrome'
});

browser.on('command', function(cmd, args) {
	console.log(' \x1b[33m%s\x1b[0m: %s', cmd, args.join(', '));
});

browser
	.chain
	.session()
	.setTimeout(5000)
	.open('/')

.waitForPageToLoad(10000)
	.assertTitle('C Ionian (Scalear 0.4.8)')
	.assertAttribute('css=svg g.labels@style', 'opacity: 1;')
	.assertText('css=h1.title', 'C Ionian')
	.assertNotAttribute('css=body@class')

.click('css=.two-values-switch')
	.assertAttribute('css=body@class', 'dark')
	.click('css=.two-values-switch')
	.assertAttribute('css=body@class', '')

.click('css=input#note-names')
	.assertAttribute('css=svg g.labels@style', 'opacity: 0;')
	.setTimeout(5000)

.click('css=input#note-names')
	.assertAttribute('css=svg g.labels@style', 'opacity: 1;')
	.setTimeout(5000)

.select('css=select#scale-selector', 'label=Chromatic')
	.select('css=select#instrument-selector', 'label=Fretless (Bass)')
	.select('css=select#root-selector', 'C♯')

.assertTitle('C♯ Chromatic (Scalear 0.4.8)')
	.assertLocation('http://localhost:8000/#/fretless-bass/chromatic/c#/')
	.assertText('css=h1.title', 'C♯ Chromatic')

.setTimeout(5000)
	.testComplete()
	.end(function(err) {
		if (err) throw err;
		console.log('Passed!');
	});