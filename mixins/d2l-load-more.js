const options = {
//	credentials: 'include',
	headers: new Headers({
		'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjI4NzM1N2ZhLWE1NjUtNDEzNi05ZTZhLWMyOWNhOWMzZDkxNyJ9.eyJzdWIiOiIxNjkiLCJ0ZW5hbnRpZCI6IjBjZGY0NDQ4LTczZmItNGIxMy1hNWI0LTE4Nzc2OTFmOWI2NiIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiIxODliYzc1Ny0xMzdhLTRjOGUtYTZlNi1mYWE1YTVkNWRlOTMiLCJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTY4OTA4OTQ1LCJuYmYiOjE1Njg5MDUzNDV9.dmmaDEF1Ems41QljKfobCIkCekcammU1FozkVN2sRxQ77niLL-LpNwlowkcMTXQ446tSTvSGhdQ9L0gIjYP2Vp3LzOJTwBjeafGNF-_hBSiCVP_k7xIFbjhAxPttNCSh25UmE-t3VTDN3nNgZSOy1D1Js8nrujd66n1BhIVR7akH0MQUgX1rebfqPm4bvYdiA9II7PT3s7B8GQb6AKnOdyvKptOreyxg7dl4OnlQozxQnb2bTBMsNl-UJyMKf9W8O20p6iyZZiG-bACrVbqEc5O7MY4PdPGK-BpcOljd5ucXLD4MrmHCoWNrwWOuxh4FZiAljAtXNxnpXfyfy2-rhw',
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
				this.$.toast.subtext = this.localize('toastCouldNotLoad');
				this.$.toast.open = true;
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
