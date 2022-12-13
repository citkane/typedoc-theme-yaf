import {
	YAFDataObject,
	YafDeclarationReflection,
} from '../../../types/types.js';
import yafElement from '../../YafElement.js';
import { YafMemberDeclaration } from './YafMemberDeclaration.js';
import { YafMemberGetterSetter } from './YafMemberGetterSetter.js';
import { YafMemberSignatures } from './YafMemberSignatures.js';
import events from '../../lib/events/eventApi.js';

const { action } = events;

export class YafMember extends HTMLElement {
	props!: YAFDataObject;
	headerElement!: HTMLElement;

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { name, signatures, flags, comment, has, is, groups, id } =
			this.props;

		/*
		const flagsElement = yafElement.makeElement<
			YafFlags,
			YafFlags['props']
		>('yaf-widget-flags', null, null, { flags, comment });
		*/

		const flagsElement = yafElement.makeFlags(flags, comment);
		this.headerElement = yafElement.makeElement('h3', 'header');
		const nameElement = yafElement.makeNameSpan('');
		const inner = yafElement.makeElement('div', 'inner');

		nameElement.appendChild(yafElement.makeNameSpan(name));
		nameElement.appendChild(yafElement.makeIconSpan('link'));
		this.headerElement.appendChild(nameElement);
		this.headerElement.appendChild(flagsElement);

		events.on(
			'click',
			() => events.dispatch(action.menu.scrollTo(String(id))),
			this.headerElement
		);

		if (signatures) {
			inner.appendChild(
				yafElement.makeElement<
					YafMemberSignatures,
					YafMemberSignatures['props']
				>('yaf-member-signatures', null, null, signatures)
			);
		} else if (has.getterOrSetter) {
			inner.appendChild(
				yafElement.makeElement<
					YafMemberGetterSetter,
					YafMemberGetterSetter['props']
				>('yaf-member-getter-setter', null, null, this.props)
			);
		} else if (is.referenceReflection) {
			console.error('TODO', this.props);
		} else {
			inner.appendChild(
				yafElement.makeElement<
					YafMemberDeclaration,
					YafMemberDeclaration['props']
				>(
					'yaf-member-declaration',
					null,
					null,
					<YafDeclarationReflection>this.props
				)
			);
		}
		this.appendChild(this.headerElement);
		this.appendChild(inner);

		if (groups) console.warn('TODO', groups);
	}

	disconnectedCallback() {
		const { id } = this.props;
		events.off(
			'click',
			() => events.dispatch(action.menu.scrollTo(String(id))),
			this.headerElement
		);
	}
}

const yafMember = 'yaf-member';
customElements.define(yafMember, YafMember);
