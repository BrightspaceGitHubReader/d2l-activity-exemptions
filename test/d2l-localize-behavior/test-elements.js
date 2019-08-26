import '../../localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
	is: 'test-localize',
	behaviors: [ D2L.PolymerBehaviors.D2LActivityExemptions.LocalizeBehavior ],
	ready: function() {
		dom(this.root).appendChild(
			document.createTextNode(
				this.localize('ariaSelectUnselectAll')
			)
		);
	}
});
