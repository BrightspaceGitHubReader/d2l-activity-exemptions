const options = {
	credentials: 'include',
	headers: new Headers({
		'Access-Control-Allow-Origin': '*',
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
