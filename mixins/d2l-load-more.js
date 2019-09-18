const options = {
//	credentials: 'include',
	headers: new Headers({
		'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjFmZDkzNTNhLTNiNTItNDIxNS1hMzE0LTY4ODU1OTA3ZTZmYiJ9.eyJzdWIiOiIxNjkiLCJ0ZW5hbnRpZCI6IjBjZGY0NDQ4LTczZmItNGIxMy1hNWI0LTE4Nzc2OTFmOWI2NiIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiJmNTE3YjA3ZC1jMjQxLTQ2NzUtOTc0NC1iNTcxZWY3N2Y2MDQiLCJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTY4ODEyNzc4LCJuYmYiOjE1Njg4MDkxNzh9.LPDw5Ptu3pRmOkeYDF_Mi3PbrAUO4yIZupF9I_iDmk1buCVZqC8CtZH6kAvF4qgv8SM8GM297YMqeuz_C5PLxJKhi1E5G6KNZBDmmfEJk4zeVLqDfCMEff1A7jZOYOBz2ZAy7zmU4wHs6F40UfwVMB398rJmBJvFl_wXFsXc8MHQX9-fqbVgtCVgKtMarhabaPXWC5wgB83TCKmsw6ZoCOFNzpolOQrEU3PmT51KntVmH1oQnWnqULaqZ_epkyM2M93n9EfKvoubZZIt_OxnMio1UIAAjtb28ERdrLL_v1ncGTZMbF23ousKufb8EDplLZrx7SvXeQyJMvtpWdOelw',
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
			notify: true
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
				.then(r => r.json())
				.then(d => this.__loadPagedData(d)),
			fetch(this.exemptionsUrl, options)
				.then(r => r.json())
				.then(b => this.exemptions = b)
		])
			.then(() => {
				this.__mapUserData();
			})
			.catch(() => {
				this.$.toast.text = this.localize('lblCouldNotLoad');
				this.$.toast.show();
			});
	},

	loadMore() {
		let url = this.classlistUrl;

		if (this.searchTerm) {
			url += `&searchTerm=${this.searchTerm}`;
		}
		if (this.bookmark) {
			url += `&bookmark=${this.bookmark}`;
		}

		fetch(url, options)
			.then(r => r.json())
			.then(d => {
				this.__loadPagedData(d);
				this.__mapUserData();
			});
	},

	__mapUserData() {
		this.set('userData', this.classlistItems.map(
			(user)=>{
				user.IsExempt = this.exemptions.some(e => {
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
		this.push('classlistItems', ...pagedData.Items);
	}
};

window.D2L = window.D2L || {};
window.D2L.Polymer = window.D2L.Polymer || {};
window.D2L.Polymer.Mixins = window.D2L.Polymer.Mixins || {};
window.D2L.Polymer.Mixins.D2LActivityExemptions = window.D2L.Polymer.Mixins.D2LActivityExemptions || {};
window.D2L.Polymer.Mixins.D2LActivityExemptions.LoadMoreExemptionsBehavior = LoadMoreExemptionsBehaviorImpl;
