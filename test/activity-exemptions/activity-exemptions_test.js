/*global beforeEach describe it flush expect fixture element MockInteractions*/

describe('activity-exemptions', function() {
	beforeEach(function() {
		element = fixture('basic'); //eslint-disable-line no-global-assign
	});

	it('should instantiate the element', function() {
		expect(element.is).to.equal('activity-exemptions');
	});

	it('should select all checkboxes', function(done) {
		element.exemptions = [
			{'firstname':'Benjamin', 'lastname':'Liam', 'isExempt':true},
			{'firstname':'Isabella', 'lastname':'Madison', 'isExempt':true},
			{'firstname':'Ethan', 'lastname':'Avery', 'isExempt':false},
			{'firstname':'David', 'lastname':'Aubrey', 'isExempt':true}
		];
		flush(function() {
			var items = Polymer.dom(element.root).querySelectorAll('.row-user');
			expect(items.length).to.equal(4);

			var checkbox = Polymer.dom(element.root).querySelector('d2l-checkbox');
			checkbox = checkbox.$$('input');
			checkbox.addEventListener('click', function() {
				flush(function() {
					items.forEach(function(row) {
						expect(row.querySelector('d2l-checkbox').checked).to.equal(true);
					}, this);
					done();
				});
			});
			MockInteractions.tap(checkbox);
		});
	});

	it('should de-select all checkboxes', function(done) {
		element.exemptions = [
			{'firstname':'Benjamin', 'lastname':'Liam', 'isExempt':true},
			{'firstname':'Isabella', 'lastname':'Madison', 'isExempt':true},
			{'firstname':'Ethan', 'lastname':'Avery', 'isExempt':false},
			{'firstname':'David', 'lastname':'Aubrey', 'isExempt':true}
		];

		// Manually set all checkboxes to checked
		flush(function() {
			var checkboxes = Polymer.dom(element.root).querySelectorAll('d2l-checkbox');
			checkboxes.forEach(function(element) {
				element.checked = true;
			});
		});

		// Verify that all checkboxes are indeed checked
		flush(function() {
			var items = Polymer.dom(element.root).querySelectorAll('.row-user');
			items.forEach(function(element) {
				expect(element.querySelector('d2l-checkbox').checked).to.equal(true);
			}, this);
		});

		// Click the '(de)select all' checkbox, and verify that all rows are unselected
		flush(function() {
			var items = Polymer.dom(element.root).querySelectorAll('.row-user');
			expect(items.length).to.equal(4);
			var checkbox = Polymer.dom(element.root).querySelector('d2l-checkbox').$$('input');
			checkbox.addEventListener('click', function() {
				flush(function() {
					items.forEach(function(element) {
						expect(element.querySelector('d2l-checkbox').checked).to.equal(false);
					}, this);
					done();
				});
			});
			MockInteractions.tap(checkbox);
		});
	});
});
