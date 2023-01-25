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
import { componentName, yafEventList } from '../../../types/frontendTypes';
import {
	YafContentHeader,
	YafContentHierarchy,
	YafContentMarked,
	YafContentMembers,
} from '.';
import { YafTypeParameters } from '../Type/index.js';
import appState from '../../handlers/AppState.js';
import { makeElement } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
import { action, events } from '../../handlers/index.js';

const { trigger, action } = events;

export class YafContent extends YafHTMLElement {
	onConnect() {
		this.events.forEach((event) => events.on(...event));
		this.initPageData();
	}
	disconnectedCallback() {
		this.events.forEach((event) => events.off(...event));
	}

	private initPageData = () => {
		const url = new URL(window.location.href);
		let page = url.searchParams.get('page');
		page = decodeURIComponent(page || '');
		const bodyHTMLElement = document.querySelector('body');
		bodyHTMLElement?.classList.add('loading');

		appState.getPageData(page || 'index').then((data) => {
			const newId = String(data.id);
			if (this.id !== newId) this.renderPageContent(data);
			this.id = newId;

			const scrollTop = appState.scrollTops[this.id] || 0;

			events.dispatch(
				action.content.scrollTo(
					url.hash ? url.hash.replace('#', '') : scrollTop
				)
			);

			bodyHTMLElement?.classList.remove('loading');
		});
	};
	private renderPageContent(data: YAFDataObject) {
		const { kind, typeParameter, signatures, text, hierarchy, id, is } =
			data;
		const { factory } = YafContent;
		const { Variable, TypeAlias } = appState.reflectionKind;
		const isVarOrTypeDeclaration =
			[Variable, TypeAlias].includes(kind) && data.is.declaration;
		const hasReadme = !!text?.readme;
		const hasComment = !!text?.comment;
		const hasHierchy = is.declaration && hierarchy;

		const HTMLElements = isVarOrTypeDeclaration
			? [
					factory.contentHeader(data),
					factory.memberDeclaration(data as YafDeclarationReflection),
			  ]
			: [
					hasReadme
						? factory.contentMarked(text.readme!)
						: factory.contentHeader(data),
					hasComment
						? factory.contentMarked(text.comment!)
						: undefined,

					typeParameter
						? factory.typeParameters(typeParameter)
						: undefined,
					hasHierchy
						? factory.contentHierarchy(hierarchy!, id)
						: undefined,
					signatures
						? factory.memberSignatures(signatures)
						: factory.memberSources(
								data as YafDeclarationReflection
						  ),

					factory.memberGroups(data),
			  ];

		this.replaceChildren();

		HTMLElements.forEach((element) => {
			if (!element) return;
			this.appendChild(element);
			if ('drawers' in element) element.drawers!.renderDrawers();
		});
		events.dispatch(action.content.breadcrumb(id));
	}
	private saveScrollTop = ({
		detail,
	}: CustomEvent<action['content']['scrollTop']>) => {
		appState.setScrollTop(this.id, Number(detail.scrollTop));
	};
	private returnPageId = (e: ReturnType<typeof action.content.getPageId>) =>
		e.detail.callBack(Number(this.id));

	/**
	 * @event
	 */
	private events: yafEventList = [
		[trigger.content.setLocation, this.initPageData],
		[trigger.content.getPageId, this.returnPageId],
		[trigger.content.scrollTop, this.saveScrollTop],
		['popstate', this.initPageData, window],
	];

	private static factory = {
		contentHeader: (data: YAFDataObject) =>
			makeElement<YafContentHeader, YafContentHeader['props']>(
				'yaf-content-header',
				null,
				null,
				data
			),
		contentMarked: (html: htmlString) =>
			makeElement<YafContentMarked, YafContentMarked['props']>(
				'yaf-content-marked',
				null,
				null,
				html
			),
		memberDeclaration: (data: YafDeclarationReflection) =>
			makeElement<YafMemberDeclaration, YafMemberDeclaration['props']>(
				'yaf-member-declaration',
				null,
				null,
				{ data, idPrefix: '' }
			),
		memberGroups: (data: YAFDataObject) =>
			makeElement<YafContentMembers, YafContentMembers['props']>(
				'yaf-content-members',
				null,
				null,
				data
			),
		typeParameters: (typeParameter: YafTypeParameterReflection[]) =>
			makeElement<YafTypeParameters, YafTypeParameters['props']>(
				'yaf-type-parameters',
				null,
				null,
				typeParameter
			),
		memberSignatures: (signatures: YafSignatureReflection[]) =>
			makeElement<YafMemberSignatures, YafMemberSignatures['props']>(
				'yaf-member-signatures',
				null,
				null,
				signatures
			),
		memberSources: (data: YafDeclarationReflection) => {
			return data
				? makeElement<YafMemberSources, YafMemberSources['props']>(
						'yaf-member-sources',
						null,
						null,
						data
				  )
				: undefined;
		},

		contentHierarchy: (hierarchy: hierarchy[], id: number) =>
			makeElement<YafContentHierarchy, YafContentHierarchy['props']>(
				'yaf-content-hierarchy',
				null,
				null,
				{
					hierarchy,
					pageId: String(id),
					init: true,
				}
			),
	};
}

const yafContent: componentName = 'yaf-content';
customElements.define(yafContent, YafContent);
