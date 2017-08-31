/*global beforeEach describe it flush expect fixture element*/

describe('activity-exemptions-exemptstatus', function() {
	beforeEach(function() {
		element = fixture('basic'); //eslint-disable-line no-global-assign
	});

	it('should instantiate the element', function() {
		expect(element.is).to.equal('activity-exemptions-exemptstatus');
	});

	it('should default not exempt', function(done) {
		flush(function() {
			var notExemptText = Polymer.dom(element.root).querySelector('d2l-offscreen');
			expect(notExemptText).to.not.equal(null);
			expect(notExemptText.innerText).to.equal('Not Exempt');
			done();
		});
	});

	it('should show exempt', function(done) {
		element.data = {'IsExempt': true};

		flush(function() {
			// Off screen element should not exist
			var notExemptText = Polymer.dom(element.root).querySelector('d2l-offscreen');
			expect(notExemptText).to.equal(null);

			// Element should contain exempt keyword
			expect(element.innerText).to.equal('Exempt');
			done();
		});
	});

});
