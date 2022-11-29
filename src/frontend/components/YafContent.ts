import {
	componentName,
	YAFDataObject,
	htmlString,
	YafDeclarationReflection,
	YafTypeParameterReflection,
	YafSignatureReflection,
} from '../../types/types';
import { YafElement } from '../YafElement.js';
import { YafMemberDeclaration } from './members/YafMemberDeclaration.js';
import {
	YafContentMembers,
	YafMemberSignatures,
	YafMemberSources,
} from './YafContentMembers.js';
import { YafContentHeader } from './YafContentHeader.js';
import { YafContentMarked } from './YafContentMarked.js';
import { YafTypeParameters } from './YafTypeParameters.js';

import events from '../lib/events/eventApi.js';
import appState from '../lib/AppState.js';
const { trigger, action } = events;

export class YafContent extends YafElement {
	constructor() {
		super(yafContent);
	}

	connectedCallback() {
		if (this.debounce()) return;
		events.on(trigger.content.setLocation, this.fetchLocationData);
		events.on(trigger.get.pageContentId, this.returnPageId);
		events.on('popstate', this.fetchLocationData, window);

		this.fetchLocationData();
	}
	disconnectedCallback() {
		events.off(trigger.content.setLocation, this.fetchLocationData);
		events.off(trigger.get.pageContentId, this.returnPageId);
		events.off('popstate', this.fetchLocationData, window);
	}

	fetchLocationData = () => {
		const url = new URL(window.location.href);
		const getParam = url.searchParams;
		let page = getParam.get('page');
		page = decodeURIComponent(page || '');
		appState.pageDataCache(page || 'index').then((data) => {
			this.renderPageContent(data);
			events.dispatch(
				action.content.scrollTo(
					url.hash ? url.hash.replace('#', '') : 0
				)
			);
		});
	};
	renderPageContent(data: YAFDataObject) {
		this.innerHTML = '';
		this.id = String(data.id);

		const { kind, typeParameter, signatures, text, has } = data;
		const { Variable, TypeAlias } = appState.reflectionKind;

		if ([Variable, TypeAlias].includes(kind) && data.is.declaration) {
			this.makeContentHeader(data);
			this.makeMemberDeclaration(data as YafDeclarationReflection);
			return;
		}

		text.readme
			? this.makeContentMarked(text.readme)
			: this.makeContentHeader(data);
		if (text.comment) this.makeContentMarked(text.comment);
		if (has.typeParameters) this.makeTypeParamters(typeParameter);

		if (data.is.declaration) {
			//hierarchy
			//implements
			//implemented by

			if (signatures) this.makeMemberSignatures(signatures);
			//indexsignature

			if (!signatures) this.makeSources(data as YafDeclarationReflection);
		}
		this.makeMemberGroups(data);
	}
	makeContentHeader(data: YAFDataObject) {
		const header = this.makeElement<
			YafContentHeader,
			YafContentHeader['props']
		>('yaf-content-header', null, null, data);
		this.appendChild(header);
	}

	makeContentMarked(html: htmlString) {
		const marked: YafContentMarked = this.makeElement('yaf-content-marked');
		marked.props = html;
		this.appendChild(marked);
	}

	makeMemberDeclaration(data: YafDeclarationReflection) {
		const declaration = this.makeElement<
			YafMemberDeclaration,
			YafMemberDeclaration['props']
		>('yaf-member-declaration', null, null, data);

		this.appendChild(declaration);
	}

	makeMemberGroups(data: YAFDataObject) {
		const pageGroups = this.makeElement<
			YafContentMembers,
			YafContentMembers['props']
		>('yaf-content-members', null, null, {
			groups: data.groups,
			children: data.children,
		});
		this.appendChild(pageGroups);
	}
	makeTypeParamters(typeParameter: YafTypeParameterReflection[]) {
		const typeParameterElement = this.makeElement<
			YafTypeParameters,
			YafTypeParameters['props']
		>('yaf-type-parameters', null, null, typeParameter);
		this.appendChild(typeParameterElement);
	}
	makeMemberSignatures(signatures: YafSignatureReflection[]) {
		const signaturesElement: YafMemberSignatures = this.makeElement(
			'yaf-member-signatures'
		);
		signaturesElement.props = signatures;
		this.appendChild(signaturesElement);
	}
	makeSources(data: YafDeclarationReflection) {
		const sourcesElement = this.makeElement<
			YafMemberSources,
			YafMemberSources['props']
		>('yaf-member-sources', null, null, data);
		this.appendChild(sourcesElement);
	}

	returnPageId = (e: ReturnType<typeof action.get.pageContentId>) =>
		e.detail.callBack(this.id);
}

const yafContent: componentName = 'yaf-content';
customElements.define(yafContent, YafContent);
