/*global beforeEach describe it expect fixture element*/

describe('activity-exemptions-username', function() {
	beforeEach(function() {
		element = fixture('basic'); //eslint-disable-line no-global-assign
	});

	it('should instantiate the element', function() {
		expect(element.is).to.equal('activity-exemptions-username');
	});
});

describe('activity-exemptions-username specified with name', function() {
	beforeEach(function() {
		element = fixture('with_name'); //eslint-disable-line no-global-assign
	});

	it('should show the specified username', function() {
		expect(element.innerText).to.equal('Smith, Jaime');
	});
});
