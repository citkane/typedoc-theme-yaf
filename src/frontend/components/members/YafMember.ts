import { YAFDataObject, YafDeclarationReflection } from '../../types.js';
import { YafElement } from '../../YafElement.js';
import { YafMemberDeclaration } from './YafMemberDeclaration.js';
import { YafFlags } from '../YafFlags.js';
import { YafMemberGetterSetter } from './YafMemberGetterSetter.js';
import { YafMemberSignatures } from './YafMemberSignatures.js';

export class YafMember extends YafElement {
	props!: YAFDataObject;
	constructor() {
		super(yafMember);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const { name, signatures, flags, comment, has, is, children, groups } =
			this.props;

		const flagsElement: YafFlags = this.makeElement('<yaf-flags />');
		flagsElement.props = { flags, comment };

		const header = this.makeElement('<h3 />');
		header.classList.add('header');
		header.appendChild(this.makeSpan(name));
		header.appendChild(flagsElement);

		this.appendChild(header);

		const inner = this.makeElement('<div />');
		inner.classList.add('inner');

		if (signatures) {
			const signaturesElement: YafMemberSignatures = this.makeElement(
				'<yaf-member-signatures />'
			);
			signaturesElement.props = signatures;
			inner.appendChild(signaturesElement);
		} else if (has.getterOrSetter) {
			const getterSetter: YafMemberGetterSetter = this.makeElement(
				'<yaf-member-getter-setter />'
			);
			getterSetter.props = this.props;
			inner.appendChild(getterSetter);
		} else if (is.referenceReflection) {
			console.error(this.props);
		} else {
			const declaration: YafMemberDeclaration = this.makeElement(
				'<yaf-member-declaration />'
			);
			declaration.props = this.props as YafDeclarationReflection;
			inner.appendChild(declaration);
		}
		this.appendChild(inner);
		if (groups) console.warn('TODO', groups);
	}
}

const yafMember = 'yaf-member';
customElements.define(yafMember, YafMember);
