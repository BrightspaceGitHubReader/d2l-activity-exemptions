const options = {
//	credentials: 'include',
	headers: new Headers({
		'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjRiMzgyZGRjLTI5OTktNGNhMi1iNGQ0LWQzNjU4Y2ZlMGM0ZSJ9.eyJzdWIiOiIxNjkiLCJ0ZW5hbnRpZCI6IjBjZGY0NDQ4LTczZmItNGIxMy1hNWI0LTE4Nzc2OTFmOWI2NiIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiIzODY5ZGIzZC00MjE4LTQ4MjgtYjc0MS0yNjFiOTVhMjcwYmQiLCJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTY4MzIzODQzLCJuYmYiOjE1NjgzMjAyNDN9.I7S1CORsCxzZk28LMY4CzMbjqawmmDymGZ-cyVx5AbMX-KW96PAxKFVOga3_G5d34qlbLKKuR8QpNNZ7W1xb53D90pVcB3cWaQfNSchCLqjSX3Ai21k81EWB7E0ykyRhsXVVKEIf2WQsz-qTHnocjC8wtj1IgRYjG9Dmsdo_uOKI8ooJiTKkNDKPcr-9eaw0Lrks6K9DUrQkaOt5GF3dsksphkFvf0JlrhlpwGaZInIKU89CnLzO8ewMZ1RAX7dU0jCzGmUq7ca3Fpl5fsXVnhOws40np_Mkryrx5SDtRb5drxdCuOoCJ4eRZDUXm4oEG76MFnwPhN_rfnwi16pqVA',
//		'Access-Control-Allow-Origin': 'KLX0-BKAINS.desire2learn.d2l',
//		'X-Csrf-Token': "4gxBmXgBcsZHaosAV9LsvLiZhj1UGj4m" 
	}),
	method: 'GET',
	mode: 'cors'
};

const LoadMoreExemptionsBehaviorImpl = {
	properties: {
		bookmark: {
			type: String
		},
		classlistUrl: {
			type: String
		},
		exemptions: {
			type: Array
		},
		exemptionsUrl: {
			type: String
		},
		hasMoreItems: {
			type: Boolean
		},
		classlistItems: {
			type: Array,
			value: []
		},
		userData: {
			type: Array,
			value: []
		},
		page: {
			type: Number,
			value: 0
		}
	},
	ready() {
		Promise.all([
			fetch(this.classlistUrl, options)
				.then( r => r.json() )
				.then( d => this.__loadPagedData(d) ),
			fetch(this.exemptionsUrl, options)
				.then( r => r.json() )
				.then( b => this.exemptions = b )
		])
			.then( () => {
				this.__mapUserData();
			})
			.catch( () => {
				this.$.toast.text = this.localize('lblCouldNotLoad');
				this.$.toast.show();
			});
	},

	loadMore() {
		let url = this.classlistUrl;

		if ( this.bookmark ) {
			url += `?bookmark=${this.bookmark}`;
		}

		fetch(url, options)
			.then( r => r.json() )
			.then( d => {
				this.__loadPagedData(d);
				this.__mapUserData();
			});
	},

	__mapUserData() {
		console.log("map user data called");
		this.set('userData', this.classlistItems.map(
			(user)=>{
				user.IsExempt = this.exemptions.some( e => {
					return e.UserId === user.Identifier;
				});
				return user;
			}
		));
	},

	__loadPagedData(pagedData) {
		this.page++;
		this.bookmark = pagedData.PagingInfo.Bookmark;
		this.hasMoreItems = pagedData.PagingInfo.HasMoreItems;
		this.push( 'classlistItems', ...pagedData.Items );
	}
};

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.D2LActivityExemptions = window.D2L.Polymer.Mixins.D2LActivityExemptions || {};
window.D2L.Polymer.Mixins.D2LActivityExemptions.LoadMoreExemptionsBehavior = LoadMoreExemptionsBehaviorImpl;
