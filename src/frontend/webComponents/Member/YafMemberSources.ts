import {
	YafDeclarationReflection,
	YafSignatureReflection,
} from '../../../types/types.js';
import yafElement from '../../yafElement.js';

export class YafMemberSources extends HTMLElement {
	props!: YafSignatureReflection | YafDeclarationReflection;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { sources } = this.props;

		if (sources) {
			const header = yafElement.makeElement('h5', null, 'Defined in:');
			this.appendChild(header);

			const ul = yafElement.makeElement('ul');
			sources?.forEach((source) => {
				const { fileName, line, url } = source;
				const li = yafElement.makeElement('li');
				if (url) {
					const link = yafElement.makeLinkElement(
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
