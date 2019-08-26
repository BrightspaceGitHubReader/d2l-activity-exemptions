import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-toast/paper-toast.js';
import 'd2l-table/d2l-table.js';
import 'd2l-button/d2l-button.js';
import 'd2l-offscreen/d2l-offscreen.js';
import 'd2l-simple-overlay/d2l-simple-overlay.js';
import 'd2l-offscreen/d2l-offscreen.js';
import 'd2l-inputs/d2l-input-checkbox.js';
import 'd2l-inputs/d2l-input-checkbox-spacer.js';
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
                [[localize('lblFirstName')]]
              </d2l-th>
              <d2l-th scope="col" role="columnheader" aria-sort="none">
                [[localize('lblLastName')]]
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
            <template is="dom-repeat" items="[[userData]]" observe="IsExempt">
              <d2l-tr class="row-user" role="row" data="[[item]]">
                <d2l-td>
                  <d2l-input-checkbox
                    class="checkbox-user"
                    aria-label$="[[localize('ariaSelectUser', 'lastName', item.LastName, 'firstName', item.FirstName)]]"
                  >
                  </d2l-input-checkbox>
                </d2l-td>

                <d2l-th scope="row" role="rowheader" class="userfullname">
                  [[item.FirstName]]
                </d2l-th>
                <d2l-th scope="row" role="rowheader" class="userfullname">
                  [[item.LastName]]
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
            class="toggle-exemption-buttons"
            role="button"
            aria-label$="[[localize('ariabtnLoadMore')]]"
            on-click="loadMore"
          >
            [[localize('btnLoadMore')]]
          </d2l-button>
        </template>

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

        <paper-toast id="toast"></paper-toast>
      </div>
    `;
	}

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
			}
		};
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
		var token = D2L.LP.Web.Authentication.Xsrf.GetXsrfToken();
		const options = {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				'X-Csrf-Token': token
			}),
			method: isExempt ? 'POST' : 'DELETE',
			mode: 'cors'
		};

		var allPromises = filteredSelection.map(element => {
			return fetch(
				`${this.exemptionsUpdateUrl}&userId=${element.data.Identifier}`,
				options
			).then(() => {
				const rowIndex = element.rowIndex - 1; //offset for header
				this.set(`userData.${rowIndex}.IsExempt`, isExempt);
			});
		});

		Promise.all(allPromises).then(() => {
			this.showSaveToast(isExempt, allPromises.length);
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
