import {
	YAFDataObject,
	htmlString,
	YafDeclarationReflection,
	YafTypeParameterReflection,
	YafSignatureReflection,
} from '../../types/types';
import {
	YafContentMembers,
	YafMemberSignatures,
	YafMemberSources,
} from './YafContentMembers.js';
import yafElement from '../YafElement.js';
import { YafMemberDeclaration } from './members/YafMemberDeclaration.js';
import { YafContentHeader } from './YafContentHeader.js';
import { YafContentMarked } from './YafContentMarked.js';
import { YafTypeParameters } from './YafTypeParameters.js';
import events from '../lib/events/eventApi.js';
import appState from '../lib/AppState.js';
import { componentName } from '../../types/frontendTypes';
const { trigger, action } = events;

export class YafContent extends HTMLElement {
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
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
		appState.getPageData(page || 'index').then((data) => {
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
		console.warn(data);
		this.makeMemberGroups(data);
	}
	makeContentHeader = (data: YAFDataObject) =>
		this.appendChild(
			yafElement.makeElement<YafContentHeader, YafContentHeader['props']>(
				'yaf-content-header',
				null,
				null,
				data
			)
		);

	makeContentMarked = (html: htmlString) =>
		this.appendChild(
			yafElement.makeElement<YafContentMarked, YafContentMarked['props']>(
				'yaf-content-marked',
				null,
				null,
				html
			)
		);

	makeMemberDeclaration = (data: YafDeclarationReflection) =>
		this.appendChild(
			yafElement.makeElement<
				YafMemberDeclaration,
				YafMemberDeclaration['props']
			>('yaf-member-declaration', null, null, data)
		);

	makeMemberGroups = (data: YAFDataObject) =>
		this.appendChild(
			yafElement.makeElement<
				YafContentMembers,
				YafContentMembers['props']
			>('yaf-content-members', null, null, {
				groups: data.groups,
				children: data.children,
				pageId: this.id,
			})
		);

	makeTypeParamters = (typeParameter: YafTypeParameterReflection[]) =>
		this.appendChild(
			yafElement.makeElement<
				YafTypeParameters,
				YafTypeParameters['props']
			>('yaf-type-parameters', null, null, typeParameter)
		);

	makeMemberSignatures = (signatures: YafSignatureReflection[]) =>
		this.appendChild(
			yafElement.makeElement<
				YafMemberSignatures,
				YafMemberSignatures['props']
			>('yaf-member-signatures', null, null, signatures)
		);

	makeSources = (data: YafDeclarationReflection) =>
		this.appendChild(
			yafElement.makeElement<YafMemberSources, YafMemberSources['props']>(
				'yaf-member-sources',
				null,
				null,
				data
			)
		);

	returnPageId = (e: ReturnType<typeof action.get.pageContentId>) =>
		e.detail.callBack(this.id);
}

const yafContent: componentName = 'yaf-content';
customElements.define(yafContent, YafContent);
