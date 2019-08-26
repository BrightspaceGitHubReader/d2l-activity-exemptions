/*global describe beforeEach it expect fixture*/
describe('d2l-localize-behavior', function() {
	let elem;

	beforeEach(function() {
		document.documentElement.lang = '';
		document.documentElement.removeAttribute('data-lang-default');
		elem = fixture('localize-test');
	});

	[
		{
			label: 'English',
			code: 'en',
			expected: 'Select / Unselect all'
		}
	].forEach(function(val) {
		it('should render in ' + val.label, function() {
			document.documentElement.lang = val.code;
			expect(elem.innerText).to.eql(val.expected);
		});
	});

	[
		'EN',
		'EN-XX',
		'',
		'XX'
	].forEach( lang => {
		it(`should fall back to base language when lang is: '${lang}'`, function() {
			document.documentElement.lang = 'EN';
			expect(elem.innerText).to.eql('Select / Unselect all');
		});
	});

	it('should fall back to org default language', function() {
		document.documentElement.lang = '';
		document.documentElement.setAttribute('data-lang-default', 'en');
		expect(elem.innerText).to.eql('Select / Unselect all');
	});
});
