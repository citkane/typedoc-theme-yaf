import { JSONOutput, SignatureReflection } from 'typedoc';
import {
	YafDeclarationReflection,
	YafSignatureReflection,
} from '../../types.js';
import { YafElement } from '../../YafElement.js';
import { YafNavigationLink } from '../YafNavigationLink.js';

export class YafMemberSources extends YafElement {
	props!: YafSignatureReflection | YafDeclarationReflection;

	constructor() {
		super(yafMemberSources);
	}

	connectedCallback() {
		if (this.debounce()) return;

		const {
			sources,
			implementationOf,
			implementedBy,
			inheritedFrom,
			overwrites,
		} = this.props;

		if (sources) {
			console.log(sources);
			const header = this.makeElement('<h5 />');
			header.innerText = 'Defined in:';
			this.appendChild(header);
			const ul = this.makeElement('<ul />');
			sources?.forEach((source) => {
				const { fileName, line, url } = source;
				const li = this.makeElement('<li />');
				if (url) {
					const link: YafNavigationLink = this.makeElement(
						'<yaf-navigation-link />'
					);
					link.props = url;
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
