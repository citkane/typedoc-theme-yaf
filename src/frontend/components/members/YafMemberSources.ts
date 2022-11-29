import { JSONOutput, SignatureReflection } from 'typedoc';
import {
	YafDeclarationReflection,
	YafSignatureReflection,
} from '../../../types/types.js';
import { YafElement } from '../../YafElement.js';
import { YafNavigationLink } from '../YafNavigationLink.js';

export class YafMemberSources extends YafElement {
	props!: YafSignatureReflection | YafDeclarationReflection;

	constructor() {
		super(yafMemberSources);
	}

	connectedCallback() {
		if (this.debounce()) return;

		const { sources } = this.props;

		if (sources) {
			const header = this.makeElement('h5', null, 'Defined in:');
			this.appendChild(header);

			const ul = this.makeElement('ul');
			sources?.forEach((source) => {
				const { fileName, line, url } = source;
				const li = this.makeElement('li');
				if (url) {
					const link = this.makeLinkElement(
						url,
						undefined,
						`${fileName}:${line}`
					);
					li.appendChild(link);
				} else {
					li.innerText = `${fileName}:${line}`;
				}
				ul.appendChild(li);
			});

			this.appendChild(ul);
		}
	}
}

const yafMemberSources = 'yaf-member-sources';
customElements.define(yafMemberSources, YafMemberSources);
