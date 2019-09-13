const options = {
//	credentials: 'include',
	headers: new Headers({
		'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjA0ZTVkODM2LWIxOTgtNDQ4NS1hYTI5LTRlN2U0YTQxMjk3YiJ9.eyJzdWIiOiIxNjkiLCJ0ZW5hbnRpZCI6IjBjZGY0NDQ4LTczZmItNGIxMy1hNWI0LTE4Nzc2OTFmOWI2NiIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiIyZGI0ZTE3YS0wODgzLTQ3ZjMtYTQyZC00ZjdlMzhkNGU5N2MiLCJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTY4Mzg4MTAyLCJuYmYiOjE1NjgzODQ1MDJ9.EdzbPDDqvyUS2oj-KZeluQHCGWn9Pa0EfDJ9evcieEKcCw2HITKZjn7lFiPgZrj2dD08uHWDq3LgGjkz2Bfvx8Pb8RR_ktygbzHuXJDcnkF9aBA0J42DJrAT1yY8YekLuHuHF-nrgu77Pwox4DK7Y0B7-bTQ0G9CJBBK6Dl6x691HjhJQXxllr0aLRzWgr2zzB6e_OsBFUA3haw9YeJZehEHGzZWruoQpg6hixYcFA9DdnopVXdqwNmOSjqadWksGoCrt1ZOaksehFJIux8dIsY3KA5c41hwvgcwpFDV8IURIMy0pLkODk0GyxvCVDuzsxzGCgu45Ymxu_ylivhLDw',
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
