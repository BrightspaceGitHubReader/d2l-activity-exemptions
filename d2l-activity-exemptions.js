import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-toast/paper-toast.js';
import 'd2l-table/d2l-table.js';
import 'd2l-button/d2l-button.js';
import 'd2l-offscreen/d2l-offscreen.js';
import 'd2l-simple-overlay/d2l-simple-overlay.js';
import 'd2l-offscreen/d2l-offscreen.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-inputs/d2l-input-checkbox-spacer.js';
import 'd2l-inputs/d2l-input-search.js';
import './localize-behavior.js';
import './mixins/d2l-load-more.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
/*
 * @polymer
 * @customElement
 * @extends PolymerElement
 * @appliesMixin D2L.PolymerBehaviors.D2LActivityExemptions.LocalizeBehavior
 */
class D2LActivityExemptions extends mixinBehaviors(
	[
		D2L.PolymerBehaviors.D2LActivityExemptions.LocalizeBehavior,
		D2L.Polymer.Mixins.D2LActivityExemptions.LoadMoreExemptionsBehavior,
	],
	PolymerElement
) {
	static get is() {
		return 'd2l-activity-exemptions';
	}
	static get properties() {
		return {
			exemptionCount: {
				type: String,
				computed: 'getUserExemptionCount(userData.*)'
			},
			exemptionsUpdateUrl: {
				type: String
			},
			searchValue: {
				type: String,
				value: '',
				notify: true,
				reflectToAttribute: true
			}
		};
	}
	static get template() {
		return html`
	  <style>
		:host {
		  display: block;
		  padding-bottom: 40px;
		}

		paper-toast {
		  width: 350px;
		  margin-left: calc(50vw - 175px);
		  text-align: center;
		}

		d2l-input-search {
			width: 250px;
			display: inline;
			float: right;
		}

		div[role=main] {
			width: 100%;
		}

		.toggle-exemption-buttons {
			padding-right: 25px;
		}

		.bottom-buttons {
			padding-top: 10px;
		}
	  </style>
	  <style include="d2l-table-style"></style>

	  <div role="main">
		<d2l-button
		  class="toggle-exemption-buttons"
		  role="button"
		  aria-label$="[[localize('ariaExempt')]]"
		  primary=""
		  on-click="exemptSelected"
		>
		  [[localize('btnExempt')]]
		</d2l-button>

		<d2l-button
		  class="toggle-exemption-buttons"
		  role="button"
		  aria-label$="[[localize('ariaUnexempt')]]"
		  on-click="unexemptSelected"
		>
		  [[localize('btnUnexempt')]]
		</d2l-button>

		<d2l-input-search id="search" placeholder="Search For...">
		</d2l-input-search>

		<div id="exemptions-count">
		  <p>[[exemptionCount]]</p>
		</div>

		<d2l-table
		  id="classlist"
		  role="grid"
		  summary="[[localize('ariaTableSummary')]]"
		  sticky-headers=""
		>
		  <d2l-offscreen>[[localize('ariaTableCaption')]]</d2l-offscreen>
		  <d2l-thead>
			<d2l-tr role="row">
			  <d2l-th>
				<d2l-input-checkbox
				  aria-label$="[[localize('selectUnselectAll')]]"
				  on-change="selectAll"
				>
				</d2l-input-checkbox>
			  </d2l-th>

			  <d2l-th scope="col" role="columnheader" aria-sort="none">
				[[localize('lblFirstName')]] [[localize('lblLastName')]]
			  </d2l-th>

			  <d2l-th scope="col" role="columnheader" aria-sort="none">
				[[localize('lblOrgDefinedId')]]
			  </d2l-th>

			  <d2l-th scope="col" role="columnheader" aria-sort="none">
				[[localize('lblExemptStatus')]]
			  </d2l-th>
			</d2l-tr>
		  </d2l-thead>

		  <d2l-tbody>
			<template id="userListRows" is="dom-repeat" items="[[userData]]" observe="IsExempt">
			  <d2l-tr class="row-user" role="row" data="[[item]]">
				<d2l-td>
				  <d2l-input-checkbox
					class="checkbox-user"
					aria-label$="[[localize('ariaSelectUser', 'lastName', item.LastName, 'firstName', item.FirstName)]]"
				  >
				  </d2l-input-checkbox>
				</d2l-td>

				<d2l-th scope="row" role="rowheader" class="userfullname">
				  [[item.FirstName]] [[item.LastName]]
				</d2l-th>

				<d2l-th scope="row" role="rowheader">
				  [[item.OrgDefinedId]]
				</d2l-th>

				<d2l-th scope="row" role="rowheader" class="exemptStatus">
				  <template is="dom-if" if="[[item.IsExempt]]">
					[[localize('lblExempt')]]
				  </template>
				  <template is="dom-if" if="[[!item.IsExempt]]">
					<d2l-offscreen>[[localize('lblNotExempt')]]</d2l-offscreen>
				  </template>
				</d2l-th>
			  </d2l-tr>
			</template>
		  </d2l-tbody>
		</d2l-table>

		<template is="dom-if" if="[[hasMoreItems]]">
		  <d2l-button
			class="toggle-exemption-buttons bottom-buttons"
			role="button"
			aria-label$="[[localize('ariabtnLoadMore')]]"
			on-click="loadMore"
		  >
			[[localize('btnLoadMore')]]
		  </d2l-button>
		</template>

		<d2l-button
		  class="toggle-exemption-buttons bottom-buttons"
		  role="button"
		  aria-label$="[[localize('ariaExempt')]]"
		  primary=""
		  on-click="exemptSelected"
		>
		  [[localize('btnExempt')]]
		</d2l-button>

		<d2l-button
		  class="toggle-exemption-buttons bottom-buttons"
		  role="button"
		  aria-label$="[[localize('ariaUnexempt')]]"
		  on-click="unexemptSelected"
		>
		  [[localize('btnUnexempt')]]
		</d2l-button>

		<paper-toast id="toast"></paper-toast>
	  </div>
	`;
	}

	ready() {
		super.ready();
		this.$.search.addEventListener('d2l-input-search-searched', this.doSearch.bind(this));
	}

	doSearch(e) {
		this.set('searchTerm', e.detail.value);
		const options = {
			headers: new Headers({
				'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ijk0ODYzZmVkLTE3YWUtNGEyOS05NzY3LWVkYjIyMTJjNzAzNSJ9.eyJzdWIiOiIxNjkiLCJ0ZW5hbnRpZCI6IjBjZGY0NDQ4LTczZmItNGIxMy1hNWI0LTE4Nzc2OTFmOWI2NiIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiJkNDRlMTExMy03MjFjLTQ0ZDAtOTdhMS00NDAyMDE0MzU0NTIiLCJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTY4NjM5NTMyLCJuYmYiOjE1Njg2MzU5MzJ9.aaJIkAIfCL4ycC_wEreVgRsputQ09zAVQMD2iBYaQm9VcnLAmTsZaQiqMGI2fzXYsXbuQPvLoDodEBECtxMDxsZxvGt4Nfjvz3xmgd6sb5Nx7KYsRItjmMjAgQC2BWiShBAh_kvaBBAd14mmaxUmzie24t3zCPik0qMb87qU8D28DLXntnlnrMfXoMcEgFJCUIFcrkakonLfDrQU8zHjDShNHDPvu7ges2xAIY68-iWHtIah0mC8QWSe6XZgPdCDpHIpKK2XRM4spFMAsiaXesZp-BAyjjR7gep1DhlEjo9-kvQl_ke-bquAkljaxfPcuRVUVOdvvfr7vRoF5dKpNA',
			}),
			method: 'GET',
			mode: 'cors'
		};
		let url = this.classlistUrl;
		url += `&searchTerm=${this.searchTerm}`;
		console.log(url);

		fetch(url, options)
			.then(r => r.json())
			.then(d => {
				this.set('classlistItems', []);
				this.__loadPagedData(d);
				this.__mapUserData();
			});
	}

	exemptSelected() {
		this._toggleExemption(true);
	}

	getUserExemptionCount() {
		const count = this.userData.filter(u => u.IsExempt).length;

		// count.toString() is required due to localize returning '' when count is 0
		return this.localize(
			'lblExemptionCount',
			'exemptionCount',
			count.toString()
		);
	}

	selectAll(e) {
		this.root
			.querySelectorAll('.checkbox-user')
			.forEach(element => {
				element.checked = e.target.checked;
			});
	}

	showSaveToast(isExempt, numChanged) {
		var actionText = isExempt ? 'lblExemptSuccess' : 'lblUnexemptSuccess';

		this.$.toast.hide();
		this.$.toast.text = this.localize(actionText, 'itemCount', numChanged);
		this.$.toast.show();
	}

	_toggleExemption(isExempt) {
		var userList = Array.from(this.$.classlist.querySelectorAll('.row-user'));
		var filteredSelection = userList.filter(
			element =>
				element.querySelector('.checkbox-user[checked]') &&
			element.data['IsExempt'] !== isExempt
		);
		var token = "UXXOlaOs97ldsbFMcpO1glAv4S95MMuV"; //D2L.LP.Web.Authentication.Xsrf.GetXsrfToken();
		const options = {
			headers: new Headers({
				'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ijk0ODYzZmVkLTE3YWUtNGEyOS05NzY3LWVkYjIyMTJjNzAzNSJ9.eyJzdWIiOiIxNjkiLCJ0ZW5hbnRpZCI6IjBjZGY0NDQ4LTczZmItNGIxMy1hNWI0LTE4Nzc2OTFmOWI2NiIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiJkNDRlMTExMy03MjFjLTQ0ZDAtOTdhMS00NDAyMDE0MzU0NTIiLCJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTY4NjM5NTMyLCJuYmYiOjE1Njg2MzU5MzJ9.aaJIkAIfCL4ycC_wEreVgRsputQ09zAVQMD2iBYaQm9VcnLAmTsZaQiqMGI2fzXYsXbuQPvLoDodEBECtxMDxsZxvGt4Nfjvz3xmgd6sb5Nx7KYsRItjmMjAgQC2BWiShBAh_kvaBBAd14mmaxUmzie24t3zCPik0qMb87qU8D28DLXntnlnrMfXoMcEgFJCUIFcrkakonLfDrQU8zHjDShNHDPvu7ges2xAIY68-iWHtIah0mC8QWSe6XZgPdCDpHIpKK2XRM4spFMAsiaXesZp-BAyjjR7gep1DhlEjo9-kvQl_ke-bquAkljaxfPcuRVUVOdvvfr7vRoF5dKpNA',
				'Content-Type': 'application/json',
			}),
			method: isExempt ? 'POST' : 'DELETE',
			mode: 'cors'
		};

		var allPromises = filteredSelection.map(element => {
			return fetch(
				`${this.exemptionsUpdateUrl}&userId=${element.data.Identifier}`,
				options
			)
				.then(res => res.json())
				.then(() => {
					const row = this.userData.findIndex(function(el) {
						if (el.Identifier === element.data.Identifier) return el;
					});
					this.set(`userData.${row}.IsExempt`, isExempt);
				});
		});

		Promise.all(allPromises).then(() => {
			this.showSaveToast(isExempt, allPromises.length);
			this.$.userListRows.render();
		});
	}

	unexemptSelected() {
		this._toggleExemption(false);
	}

	_getFullName(firstName, lastName) {
		return `${firstName} ${lastName}`;
	}
}
customElements.define(D2LActivityExemptions.is, D2LActivityExemptions);
