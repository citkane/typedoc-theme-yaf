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
import appState from '../../lib/AppState.js';
import events from '../../lib/events/eventApi.js';
import { makeElement } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';

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
		const scrollAction = action.content.scrollTo(
			url.hash ? url.hash.replace('#', '') : 0
		);
		const getParam = url.searchParams;
		let page = getParam.get('page');
		page = decodeURIComponent(page || '');

		appState.getPageData(page || 'index').then((data) => {
			this.id = String(data.id);
			this.renderPageContent(data);
			events.dispatch(scrollAction);
		});
	};
	private renderPageContent(data: YAFDataObject) {
		const {
			kind,
			typeParameter,
			signatures,
			text,
			has,
			hierarchy,
			id,
			is,
		} = data;
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

					has.typeParameters
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
	}

	private returnPageId = (e: ReturnType<typeof action.get.pageContentId>) =>
		e.detail.callBack(this.id);

	/**
	 * @event
	 */
	private events: yafEventList = [
		[trigger.content.setLocation, this.initPageData],
		[trigger.get.pageContentId, this.returnPageId],
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
				data
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
