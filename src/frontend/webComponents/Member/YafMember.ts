import {
	YAFDataObject,
	YafDeclarationReflection,
	YafSignatureReflection,
} from '../../../types/types.js';
import { YafMemberDeclaration } from './YafMemberDeclaration.js';
import { YafMemberGetterSetter } from './YafMemberGetterSetter.js';
import { YafMemberSignatures } from './YafMemberSignatures.js';
import events from '../../lib/events/eventApi.js';
import yafElement from '../../yafElement.js';
import { debouncer } from '../../../types/frontendTypes.js';
import appState from '../../lib/AppState.js';
const { debounce, makeFlags, makeElement, makeNameSpan, makeIconSpan } =
	yafElement;

const { action } = events;

export class YafMember extends HTMLElement {
	props!: YAFDataObject;

	connectedCallback() {
		if (debounce(this as debouncer)) return;

		const {
			name,
			kind,
			signatures,
			flags,
			comment,
			groups,
			getSignature,
			setSignature,
		} = this.props;

		const flagsElement = makeFlags(flags, comment);
		const headerElement = makeElement('h3', 'header');
		headerElement.onclick = this.scrollMenuToTarget;
		const nameElement = makeNameSpan('');
		const inner = makeElement('div', 'inner');
		const hasGetterOrSetter = !!getSignature || !!setSignature;
		const isReferenceReflection =
			appState.reflectionKind[kind] === 'Reference';

		nameElement.appendChild(makeNameSpan(name));
		nameElement.appendChild(makeIconSpan('link'));
		headerElement.appendChild(nameElement);
		headerElement.appendChild(flagsElement);

		const memberType = signatures
			? 'signatures'
			: hasGetterOrSetter
			? 'getterOrSetter'
			: isReferenceReflection
			? 'referenceReflection'
			: 'memberDeclaration';

		switch (memberType) {
			case 'signatures':
				inner.appendChild(this.factory.signatures(signatures));
				break;
			case 'getterOrSetter':
				inner.appendChild(this.factory.getterOrSetter());
				break;
			case 'referenceReflection':
				console.error('TODO: is this ever hit?', this.props);
				break;
			case 'memberDeclaration':
				inner.appendChild(this.factory.memberDeclaration());
		}

		const HTMLElements = [headerElement, inner];
		HTMLElements.forEach((element) => this.appendChild(element));

		if (groups) console.warn('TODO', groups);
	}

	private scrollMenuToTarget = () =>
		events.dispatch(action.menu.scrollTo(String(this.props.id)));

	private factory = {
		signatures: (signatures: YafSignatureReflection[]) =>
			makeElement<YafMemberSignatures, YafMemberSignatures['props']>(
				'yaf-member-signatures',
				null,
				null,
				signatures
			),
		getterOrSetter: () =>
			makeElement<YafMemberGetterSetter, YafMemberGetterSetter['props']>(
				'yaf-member-getter-setter',
				null,
				null,
				this.props
			),
		memberDeclaration: () =>
			makeElement<YafMemberDeclaration, YafMemberDeclaration['props']>(
				'yaf-member-declaration',
				null,
				null,
				<YafDeclarationReflection>this.props
			),
	};
}

const yafMember = 'yaf-member';
customElements.define(yafMember, YafMember);
