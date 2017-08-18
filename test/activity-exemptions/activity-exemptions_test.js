/*global describe it expect fixture*/

describe('activity-exemptions', function() {
	it('should instantiate the element', function() {
		var element = fixture('basic');
		expect(element.is).to.equal('activity-exemptions');
	});
});
