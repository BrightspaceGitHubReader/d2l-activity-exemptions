const options = {
//	credentials: 'include',
	headers: new Headers({
		'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ijk0ODYzZmVkLTE3YWUtNGEyOS05NzY3LWVkYjIyMTJjNzAzNSJ9.eyJzdWIiOiIxNjkiLCJ0ZW5hbnRpZCI6IjBjZGY0NDQ4LTczZmItNGIxMy1hNWI0LTE4Nzc2OTFmOWI2NiIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiJkNDRlMTExMy03MjFjLTQ0ZDAtOTdhMS00NDAyMDE0MzU0NTIiLCJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTY4NjM5NTMyLCJuYmYiOjE1Njg2MzU5MzJ9.aaJIkAIfCL4ycC_wEreVgRsputQ09zAVQMD2iBYaQm9VcnLAmTsZaQiqMGI2fzXYsXbuQPvLoDodEBECtxMDxsZxvGt4Nfjvz3xmgd6sb5Nx7KYsRItjmMjAgQC2BWiShBAh_kvaBBAd14mmaxUmzie24t3zCPik0qMb87qU8D28DLXntnlnrMfXoMcEgFJCUIFcrkakonLfDrQU8zHjDShNHDPvu7ges2xAIY68-iWHtIah0mC8QWSe6XZgPdCDpHIpKK2XRM4spFMAsiaXesZp-BAyjjR7gep1DhlEjo9-kvQl_ke-bquAkljaxfPcuRVUVOdvvfr7vRoF5dKpNA',
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
			value: [],
			notify: true,
			reflectToAttribute: true
		},
		page: {
			type: Number,
			value: 0
		},
		searchTerm: {
			type: String
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

	search() {
		let url = this.classlistUrl;
		console.log(this.searchTerm);
		url += `&searchTerm=${this.searchTerm}`;
		console.log(url);

		fetch(url, options)
			.then(r => r.json())
			.then(d => {
				this.__loadPagedData(d);
				this.__mapUserData();
			});
	},

	loadMore() {
		let url = this.classlistUrl;

		if ( this.searchTerm ) {
			url += `&searchTerm=${this.searchTerm}`;
		}
		if ( this.bookmark ) {
			url += `&bookmark=${this.bookmark}`;
		}

		fetch(url, options)
			.then( r => r.json() )
			.then( d => {
				this.__loadPagedData(d);
				this.__mapUserData();
			});
	},

	__mapUserData() {
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
