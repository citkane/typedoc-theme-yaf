import {
	YAFDataObject,
	htmlString,
	YafDeclarationReflection,
	YafTypeParameterReflection,
	YafSignatureReflection,
	hierarchy,
} from '../../../types/types';
import {
	YafMemberDeclaration,
	YafMemberSignatures,
	YafMemberSources,
} from '../Member/index.js';
import { componentName, DrawerElement } from '../../../types/frontendTypes';
import { YafContentHeader, YafContentMarked, YafContentMembers } from '.';
import { YafTypeParameters } from '../Type/index.js';
import appState from '../../lib/AppState.js';
import events from '../../lib/events/eventApi.js';
import yafElement from '../../YafElement.js';
import YafElementDrawers from '../../YafElementDrawers.js';

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

		const { kind, typeParameter, signatures, text, has, hierarchy, id } =
			data;
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
			const hierarchyElement = yafElement.makeElement<
				YafContentHierarchy,
				YafContentHierarchy['props']
			>('yaf-content-hierarchy', null, null, {
				hierarchy,
				pageId: String(id),
				init: true,
			});
			this.appendChild(hierarchyElement);
			hierarchyElement.drawers?.renderDrawers();

			//implements
			//implemented by

			if (signatures) this.makeMemberSignatures(signatures);
			//indexsignature

			if (!signatures) this.makeSources(data as YafDeclarationReflection);
		}
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

export class YafContentHierarchy extends HTMLElement {
	props!: {
		hierarchy: hierarchy[] | undefined;
		pageId?: string;
		init?: boolean;
	};
	drawers?: YafElementDrawers;
	drawer!: HTMLElement;
	drawerTrigger!: HTMLElement;
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		const { hierarchy, pageId, init } = this.props;
		if (!hierarchy || !hierarchy.length || this.isOrphan) return;

		this.drawer = yafElement.makeElement('ul');
		if (init) {
			this.drawerTrigger = yafElement.makeElement('h5');

			this.drawerTrigger.appendChild(
				yafElement.makeElement('span', null, 'Hierarchy')
			);
			this.drawerTrigger.appendChild(
				yafElement.makeIconSpan('expand_less')
			);
			this.appendChild(this.drawerTrigger);

			this.drawers = new YafElementDrawers(
				this as unknown as DrawerElement,
				this.drawer,
				this.drawerTrigger,
				`hierarchy_${pageId}`
			);
		}

		hierarchy.forEach((item) => {
			let li;
			if (item.isTarget || !item.linkId) {
				li = yafElement.makeElement(
					'li',
					item.isTarget ? 'target' : null,
					item.name
				);
			} else {
				li = yafElement.makeElement('li');
				const linkData = appState.reflectionMap[item.linkId];
				li.appendChild(
					yafElement.makeLinkElement(
						`?page=${linkData.fileName}`,
						undefined,
						item.name
					)
				);
			}
			this.drawer.appendChild(li);

			if (!item.children || !item.children.length) return;

			li = yafElement.makeElement('li');

			li.appendChild(
				yafElement.makeElement<
					YafContentHierarchy,
					YafContentHierarchy['props']
				>('yaf-content-hierarchy', null, null, {
					hierarchy: item.children,
				})
			);

			this.drawer.appendChild(li);
		});
		this.appendChild(this.drawer);
	}

	get isOrphan() {
		const { hierarchy, init } = this.props;
		return (
			init &&
			hierarchy &&
			hierarchy.length === 1 &&
			(!hierarchy[0].children || !hierarchy[0].children.length)
		);
	}
}
const yafContentHierarchy = 'yaf-content-hierarchy';
customElements.define(yafContentHierarchy, YafContentHierarchy);
