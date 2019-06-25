/*global beforeEach afterEach describe it flush expect fixture element MockInteractions sinon*/
describe('d2l-activity-exemptions', function() {
	beforeEach(function() {
		element = fixture('basic'); //eslint-disable-line no-global-assign
	});

	it('should instantiate the element', function() {
		expect(element).to.exist;
	});

	it('should format the name correctly', function(done) {
		element.userData = [
			{'Identifier': 1, 'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':true}
		];
		flush(function() {
			var username = Polymer.dom(element.root).querySelectorAll('.userfullname')[0].innerText;
			expect(username).to.equal('Benjamin Liam');
			done();
		});
	});

	it('exempt status should be Not Exempt for non exempted users', function(done) {
		element.userData = [
			{'Identifier': 1, 'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':false}
		];
		flush(function() {
			var exemptStatus = Polymer.dom(element.root).querySelectorAll('.exemptStatus')[0].innerText;
			expect(exemptStatus).to.equal('Not Exempt');
			done();
		});
	});

	it('exempt status should be Exempt for exempted users', function(done) {
		element.userData = [
			{'Identifier': 1, 'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':true}
		];
		flush(function() {
			var exemptStatus = Polymer.dom(element.root).querySelectorAll('.exemptStatus')[0].innerText;
			expect(exemptStatus).to.equal('Exempt');
			done();
		});
	});

	it('should select all checkboxes', function(done) {
		element.userData = [
			{'Identifier': 1, 'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':true},
			{'Identifier': 2, 'FirstName':'Isabella', 'LastName':'Madison', 'IsExempt':true},
			{'Identifier': 3, 'FirstName':'Ethan', 'LastName':'Avery', 'IsExempt':false},
			{'Identifier': 4, 'FirstName':'David', 'LastName':'Aubrey', 'IsExempt':true}
		];

		flush(function() {
			var items = Polymer.dom(element.root).querySelectorAll('.row-user');

			expect(items.length).to.equal(4);

			var checkbox = Polymer.dom(element.root).querySelector('d2l-input-checkbox');
			checkbox = checkbox.$$('input');
			checkbox.addEventListener('click', function() {
				flush(function() {
					items.forEach(function(row) {
						expect(row.querySelector('d2l-input-checkbox').checked).to.equal(true);
					}, this);
					done();
				});
			});
			MockInteractions.tap(checkbox);
		});
	});

	it('should de-select all checkboxes', function(done) {
		element.userData = [
			{'Identifier': 1, 'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':true},
			{'Identifier': 2, 'FirstName':'Isabella', 'LastName':'Madison', 'IsExempt':true},
			{'Identifier': 3, 'FirstName':'Ethan', 'LastName':'Avery', 'IsExempt':false},
			{'Identifier': 4, 'FirstName':'David', 'LastName':'Aubrey', 'IsExempt':true}
		];

		// Manually set all checkboxes to checked
		flush(function() {
			var checkboxes = Polymer.dom(element.root).querySelectorAll('d2l-input-checkbox');
			checkboxes.forEach(function(element) {
				element.checked = true;
			});

			// Verify that all checkboxes are indeed checked
			flush(function() {
				var items = Polymer.dom(element.root).querySelectorAll('.row-user');
				items.forEach(function(element) {
					expect(element.querySelector('d2l-input-checkbox').checked).to.equal(true);
				}, this);
			});

			// Click the '(de)select all' checkbox, and verify that all rows are unselected
			flush(function() {
				var items = Polymer.dom(element.root).querySelectorAll('.row-user');
				expect(items.length).to.equal(4);
				var checkbox = Polymer.dom(element.root).querySelector('d2l-input-checkbox').$$('input');
				checkbox.addEventListener('click', function() {
					flush(function() {
						items.forEach(function(element) {
							expect(element.querySelector('d2l-input-checkbox').checked).to.equal(false);
						}, this);
						done();
					});
				});
				MockInteractions.tap(checkbox);
			});
		});
	});

	it('should map the data from the exemptions and classlist call correctly', function(done) {
		element.classlistItems = [
			{'Identifier':1, 'FirstName':'Benjamin', 'LastName':'Liam'},
			{'Identifier':2, 'FirstName':'Isabella', 'LastName':'Madison'},
			{'Identifier':3, 'FirstName':'Ethan', 'LastName':'Avery'},
			{'Identifier':4, 'FirstName':'David', 'LastName':'Aubrey'}
		];

		element.exemptions = [
			{'UserId':1, 'IsExempt':true},
			{'UserId':2, 'IsExempt':true},
			{'UserId':4, 'IsExempt':true}
		];

		element.__mapUserData();
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

	it('should handle zero students', function(done) {
		element.userData = [];
		flush(function() {
			expect(element).to.exist;
			var items = Polymer.dom(element.root).querySelectorAll('.row-user');
			expect(items.length).to.equal(0);
			done();
		});
	});

	describe('d2l-activity-exemptions exempt count', function() {
		beforeEach(function() {
			element.userData = [
				{'Identifier':1, 'IsExempt':true},
				{'Identifier':2, 'IsExempt':true},
				{'Identifier':3, 'IsExempt':false},
				{'Identifier':4, 'IsExempt':true}
			];

		});
		it('should show how many users are exempted', function(done) {
			flush(function() {
				var exemptionsCount = Polymer.dom(element.root).querySelector('#exemptions-count');
				expect(exemptionsCount.innerText.trim()).to.equal('Exemptions: 3');
				done();
			});
		});

		it('should update exemptions count when the data changes', function(done) {
			flush(function() {
				var user = element.userData[0];
				user.IsExempt = false;
				element.set('userData.0', {});
				element.set('userData.0', user);
				flush(function() {
					var exemptionsCount = Polymer.dom(element.root).querySelector('#exemptions-count');
					expect(exemptionsCount.innerText.trim()).to.equal('Exemptions: 2');
					done();
				});
			});
		});

		it('should handle zero students', function(done) {
			element.userData = [];
			flush(function() {
				var exemptionsCount = Polymer.dom(element.root).querySelector('#exemptions-count');
				expect(exemptionsCount.innerText.trim()).to.equal('Exemptions: 0');
				done();
			});
		});
	});

	describe('d2l-activity-exemptions (un)exempt buttons', function() {
		var fetchStub;
		beforeEach(function() {
			fetchStub = sinon.stub( window, 'fetch' );
			const mockResponse = new window.Response(
				'{"success":true}', {
					status: 200,
					headers: {
						'Content-type': 'application/json'
					}
				});
			fetchStub.returns(Promise.resolve(mockResponse));

			element.userData = [
				{'Identifier': 1, 'FirstName':'Benjamin', 'LastName':'Liam', 'IsExempt':true},
				{'Identifier': 2, 'FirstName':'Isabella', 'LastName':'Madison', 'IsExempt':false},
				{'Identifier': 3, 'FirstName':'Ethan', 'LastName':'Avery', 'IsExempt':false},
				{'Identifier': 4, 'FirstName':'David', 'LastName':'Aubrey', 'IsExempt':true}
			];
		});
		afterEach(function() {
			fetchStub.restore();
		});

		it('should mark users exempt if they are not already exempted', function(done) {

			flush(function() {
				var checkbox = Polymer.dom(element.root).querySelector('d2l-input-checkbox').$$('input');
				var items = Polymer.dom(element.root).querySelectorAll('.row-user');
				var exemptButton = Polymer.dom(element.root).querySelectorAll('.toggle-exemption-buttons')[0];
				element.exemptionsUpdateUrl = '/exemptmythings';

				MockInteractions.tap(checkbox);
				flush(function() {
					exemptButton.addEventListener('click', function() {
						flush(function() {
							expect(items.length).to.equal(4);
							items.forEach(function() {
								expect(fetchStub.callCount).to.be.equal(2);
							}, this);
							done();
						});
					});
					MockInteractions.tap(exemptButton);
				});
			});
		});

		it('should mark exempted users unexempt', function(done) {
			flush(function() {
				var checkbox = Polymer.dom(element.root).querySelector('d2l-input-checkbox').$$('input');
				var items = Polymer.dom(element.root).querySelectorAll('.row-user');
				var unexemptButton = Polymer.dom(element.root).querySelectorAll('.toggle-exemption-buttons')[1];
				element.exemptionsUpdateUrl = '/unexemptmythings';

				MockInteractions.tap(checkbox);
				flush(function() {
					unexemptButton.addEventListener('click', function() {
						flush(function() {
							expect(items.length).to.equal(4);
							items.forEach(function() {
								expect(fetchStub.callCount).to.be.equal(2);
							}, this);
							done();
						});
					});
					MockInteractions.tap(unexemptButton);
				});
			});
		});
	});
});
