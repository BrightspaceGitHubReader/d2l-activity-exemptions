const options = {
//	credentials: 'include',
	headers: new Headers({
		'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ijk0ODYzZmVkLTE3YWUtNGEyOS05NzY3LWVkYjIyMTJjNzAzNSJ9.eyJzdWIiOiIxNjkiLCJ0ZW5hbnRpZCI6IjBjZGY0NDQ4LTczZmItNGIxMy1hNWI0LTE4Nzc2OTFmOWI2NiIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiJjYTZjMzNjNi03YWZmLTRiZmItOGI4MS03MzBjMDQzMzI5MTIiLCJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTY4NjY2OTczLCJuYmYiOjE1Njg2NjMzNzN9.rIdn1jFpi-TScFc4F0Fn2moQ_gCqsGua5DHz8Fp_5FG7xu5J1H5oNrWe4HshKYc62rrQri73Dtr4UhnUYOs70JEFXO8kTvZmA9_9FbRWlfZK3TjZb66VHX8zM63bP6UTnC4PCrCKgcmnf9kLaYrOSCtN-P6LDxYii720Dam5p1ta1VdpvBaZiZHBKmCONWZXhWMkB0dvzoWh29WYoTIqWTBai3SHirMvrKhCnlrIWvCJHuipHuSKUEej0LXyyKAWNHAN5jhkA3C3FK3g1yjELW2s3Mu06Tk--Qfph9W_JN7t95Hc60-2bUjgq86VZUloMIbMo2xHrX0XPTuKQjZ2fA',
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

	search() {
		let url = this.classlistUrl;
		url += `&searchTerm=${this.searchTerm}`;

		fetch(url, options)
			.then(r => r.json())
			.then(d => {
				this.__loadPagedData(d);
				this.__mapUserData();
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
