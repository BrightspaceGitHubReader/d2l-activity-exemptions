/*global beforeEach describe it flush expect fixture element MockInteractions*/

describe('activity-exemptions', function() {
	beforeEach(function() {
		element = fixture('basic'); //eslint-disable-line no-global-assign
	});

	it('should instantiate the element', function() {
		expect(element.is).to.equal('activity-exemptions');
	});

	it('should select all checkboxes', function(done) {
		element.userData = [
			{'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':true},
			{'FirstName':'Isabella', 'LastName':'Madison', 'IsExempt':true},
			{'FirstName':'Ethan', 'LastName':'Avery', 'IsExempt':false},
			{'FirstName':'David', 'LastName':'Aubrey', 'IsExempt':true}
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
		element.userData = [
			{'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':true},
			{'FirstName':'Isabella', 'LastName':'Madison', 'IsExempt':true},
			{'FirstName':'Ethan', 'LastName':'Avery', 'IsExempt':false},
			{'FirstName':'David', 'LastName':'Aubrey', 'IsExempt':true}
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

	it('should map the data from the exemptions and classlist call correctly', function(done) {
		element.rawClasslist = [
			{'Identifier':1, 'FirstName':'Benjamin', 'LastName':'Liam'},
			{'Identifier':2, 'FirstName':'Isabella', 'LastName':'Madison'},
			{'Identifier':3, 'FirstName':'Ethan', 'LastName':'Avery'},
			{'Identifier':4, 'FirstName':'David', 'LastName':'Aubrey'}
		];

		element.rawExemptions = [
			{'UserId':1, 'IsExempt':true},
			{'UserId':2, 'IsExempt':true},
			{'UserId':4, 'IsExempt':true}
		];

		element.mapUserData();
		expect( element.userData ).to.deep.equal(
			[
				{'Identifier':1, 'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':true},
				{'Identifier':2, 'FirstName':'Isabella', 'LastName':'Madison', 'IsExempt':true},
				{'Identifier':3, 'FirstName':'Ethan', 'LastName':'Avery', 'IsExempt':false},
				{'Identifier':4, 'FirstName':'David', 'LastName':'Aubrey', 'IsExempt':true}
			]
		);
		done();
	});
});
