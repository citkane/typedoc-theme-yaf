import {
	YAFDataObject,
	YafDeclarationReflection,
	YAFReflectionLink,
	YafSignatureReflection,
} from '../../../types/types.js';
import { YafMemberDeclaration } from './YafMemberDeclaration.js';
import { YafMemberGetterSetter } from './YafMemberGetterSetter.js';
import { YafMemberSignatures } from './YafMemberSignatures.js';
import { makeFlags, makeElement, makeLinkElement } from '../../yafElement.js';
import { yafReflectionGroup } from '../../../types/frontendTypes.js';
import appState from '../../handlers/AppState.js';
import errorHandlers from '../../handlers/ErrorHandlers.js';
import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../index.js';
import { events } from '../../handlers/index.js';

const { action } = events;

export class YafMember extends YafHTMLElement<{
	data: Omit<YAFDataObject & YAFReflectionLink, 'query'>;
	idPrefix: string;
}> {
	onConnect() {
		const {
			name,
			kind,
			signatures,
			flags,
			comment,
			groups,
			getSignature,
			setSignature,
			id,
		} = this.props.data;
		const { idPrefix } = this.props;

		const { query, hash } = appState.reflectionMap[id];
		let href = `?page=${query}`;
		if (hash) href += `#${hash}`;

		const flagsElement = flags ? makeFlags(flags, comment) : undefined;
		const headerElement = makeElement('h3', 'header');
		headerElement.onclick = this.focusMember;

		const linkHTMLElement = makeLinkElement(href, 'name', name);
		//const nameElement = linkHTMLElement.querySelector('a');
		const inner = makeElement('div', 'inner');
		const hasGetterOrSetter = !!getSignature || !!setSignature;
		const isReferenceReflection =
			kind && appState.reflectionKind[kind] === 'Reference';

		//nameElement!.appendChildren([makeNameSpan(name), makeIconSpan('link')]);
		headerElement.appendChildren([
			linkHTMLElement,
			flagsElement ? flagsElement : undefined,
		]);

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
				inner.appendChild(this.factory.memberDeclaration(idPrefix));
		}

		this.appendChildren([headerElement, inner]);

		if (groups) console.warn('TODO', groups);
	}

	private focusMember = () => {
		events.dispatch(action.menu.scrollTo(String(this.props.data.id)));
		//events.dispatch(action.content.setLocation());
	};

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
				this.props.data as YAFDataObject
			),
		memberDeclaration: (idPrefix: string) =>
			makeElement<YafMemberDeclaration, YafMemberDeclaration['props']>(
				'yaf-member-declaration',
				null,
				null,
				{ data: this.props.data as YafDeclarationReflection, idPrefix }
			),
	};

	public static serialiseReflectionGroup = (
		group: JSONOutput.ReflectionGroup,
		children: YAFDataObject[]
	): yafReflectionGroup => {
		if (!group.children) return { title: group.title, children: [] };

		const mappedChildren = group.children
			?.map(
				(id) =>
					children?.find((child) => child.id === id) ||
					appState.reflectionMap[id] ||
					id
			)
			.filter((child) => {
				if (typeof child === 'number')
					errorHandlers.notFound(
						`Did not find reflection id: ${child}`
					);
				return !!child;
			}) as Omit<YAFDataObject & YAFReflectionLink, 'query'>[];

		return { title: group.title, children: mappedChildren || [] };
	};
}

const yafMember = 'yaf-member';
customElements.define(yafMember, YafMember);
