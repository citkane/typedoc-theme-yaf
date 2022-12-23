import {
	YAFDataObject,
	YafDeclarationReflection,
	YAFReflectionLink,
	YafSignatureReflection,
} from '../../../types/types.js';
import { YafMemberDeclaration } from './YafMemberDeclaration.js';
import { YafMemberGetterSetter } from './YafMemberGetterSetter.js';
import { YafMemberSignatures } from './YafMemberSignatures.js';
import events from '../../lib/events/eventApi.js';
import {
	makeFlags,
	makeElement,
	makeNameSpan,
	makeIconSpan,
} from '../../yafElement.js';
import { yafReflectionGroup } from '../../../types/frontendTypes.js';
import appState from '../../lib/AppState.js';
import errorHandlers from '../../lib/ErrorHandlers.js';
import { JSONOutput } from 'typedoc';
import { YafHTMLElement } from '../../index.js';

const { action } = events;

export class YafMember extends YafHTMLElement<
	YAFDataObject | YAFReflectionLink
> {
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
		} = this.props;

		const flagsElement = flags ? makeFlags(flags, comment) : undefined;
		const headerElement = makeElement('h3', 'header');
		headerElement.onclick = this.scrollMenuToTarget;
		const nameElement = makeNameSpan('');
		const inner = makeElement('div', 'inner');
		const hasGetterOrSetter = !!getSignature || !!setSignature;
		const isReferenceReflection =
			kind && appState.reflectionKind[kind] === 'Reference';

		nameElement.appendChildren([makeNameSpan(name), makeIconSpan('link')]);
		headerElement.appendChildren([
			nameElement,
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
				inner.appendChild(this.factory.signatures(signatures!));
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

		this.appendChildren([headerElement, inner]);

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
				this.props as YAFDataObject
			),
		memberDeclaration: () =>
			makeElement<YafMemberDeclaration, YafMemberDeclaration['props']>(
				'yaf-member-declaration',
				null,
				null,
				<YafDeclarationReflection>this.props
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
			});

		return { title: group.title, children: mappedChildren || [] };
	};

	public static serialiseLinkGroup = (
		group: JSONOutput.ReflectionGroup,
		children: YAFDataObject[]
	) =>
		(group.children
			?.map((id) => {
				const child =
					children.find((child) => child.id === id) ||
					appState.reflectionMap[id];
				child.id = String(id);
				!child &&
					errorHandlers.notFound(
						`Did not find reflectionMap id: ${id}`
					);
				return appState.reflectionMap[id]
					? (child as YAFReflectionLink)
					: undefined;
			})
			.filter((child) => !!child) as YAFReflectionLink[]) || [];
}

const yafMember = 'yaf-member';
customElements.define(yafMember, YafMember);
