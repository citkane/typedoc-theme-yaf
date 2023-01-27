import {
	componentName,
	yafHTMLExtension,
	yafMemberGroupReflectionProps,
} from '../../../types/frontendTypes.js';
import YafElementDrawers, { DrawerElement } from '../../YafElementDrawers.js';
import { YafMember } from './YafMember.js';
import { YAFDataObject, YAFReflectionLink } from '../../../types/types.js';
import { JSONOutput } from 'typedoc';
import {
	makeElement,
	makeTitleSpan,
	makeIconSpan,
	normaliseFlags,
	makeSymbolSpan,
	makeLinkElement,
} from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
import { YafWidgetCounter, YafWidgetTagToggle } from '../Widget/index.js';
import { events } from '../../handlers/index.js';
const { action } = events;

/**
 *
 */
export class YafMemberGroupReflection extends YafHTMLElement<yafMemberGroupReflectionProps> {
	drawers!: YafElementDrawers;

	onConnect() {
		const { title, children, pageId, nested, idPrefix } = this.props;

		const { factory } = YafMemberGroupReflection;
		this.id = `member_${pageId}_${title}`;

		const drawerHTMLElement = makeElement(`ul`);
		const drawerTriggerHTMLElement = makeElement('span', 'trigger');
		const groupHeaderHTMLElement = makeElement(nested ? 'h3' : 'h2');
		const groupTitleHTMLElement = factory.makeNestedTitleSpan(
			title,
			idPrefix,
			this.pageId,
			drawerTriggerHTMLElement
		);

		const groupCountHTMLElement = factory.counterWidget(children.length);
		const drawerLiHTMLElements = factory.drawerListChildren(
			children,
			idPrefix
		);

		groupHeaderHTMLElement.appendChildren([
			groupTitleHTMLElement,
			groupCountHTMLElement,
		]);
		drawerHTMLElement.appendChildren(drawerLiHTMLElements);

		this.appendChildren([groupHeaderHTMLElement, drawerHTMLElement]);

		this.drawers = new YafElementDrawers(
			this as unknown as DrawerElement,
			drawerHTMLElement,
			drawerTriggerHTMLElement,
			this.id
		);

		drawerHTMLElement.prepend(factory.tagToggles(this.drawers));

		/**
		 * NOTE: `drawers.renderDrawers()` is called from `YafMemberDeclaration` or `YafContentMembers`.
		 * That is the root of the drawer tree and propagates downwards to branches
		 * from within the `renderDrawers` method itself.
		 */
	}
	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
	}
	get pageId() {
		let id!: number;
		events.dispatch(
			action.content.getPageId((pageId) => {
				id = pageId;
			})
		);
		return id;
	}
	private static factory = {
		drawerListChildren: (
			children: Omit<YAFDataObject & YAFReflectionLink, 'query'>[],
			idPrefix = ''
		) =>
			children.map((child) => {
				const liHTMLElement = this.factory.listItem(child.flags);
				const id = `${idPrefix ? idPrefix + '.' : ''}${child.name}`;
				liHTMLElement.id = id;
				liHTMLElement.appendChild(this.factory.member(child, id));

				return liHTMLElement;
			}),
		listItem: (flags: JSONOutput.ReflectionFlags | undefined) =>
			makeElement('li', flags ? normaliseFlags(flags).join(' ') : ''),
		member: (
			data: Omit<YAFDataObject & YAFReflectionLink, 'query'>,
			idPrefix: string
		) =>
			makeElement<YafMember, YafMember['props']>(
				'yaf-member',
				null,
				null,
				{ data, idPrefix }
			),
		tagToggles: (drawers: YafElementDrawers) => {
			const toggleHTMLElement = makeElement<
				YafWidgetTagToggle,
				YafWidgetTagToggle['props']
			>('yaf-widget-tag-toggle', 'tagtoggles', null, {
				flagCounts: drawers.flagCounts,
			});
			const liHTMLElement = makeElement('li');
			liHTMLElement.appendChild(toggleHTMLElement);
			return liHTMLElement;
		},
		counterWidget: (count: number) =>
			makeElement<YafWidgetCounter, YafWidgetCounter['props']>(
				'yaf-widget-counter',
				null,
				null,
				{
					count,
				}
			),
		makeNestedTitleSpan: (
			titleString: string,
			idPrefix: string | undefined,
			pageId: number,
			drawerTriggerHTMLElement: HTMLElement & yafHTMLExtension
		) => {
			const { makeDrawerToggle } = this.factory;

			const wrapperHTMLElement = makeElement('span', 'wrapper');

			if (!idPrefix) {
				wrapperHTMLElement.appendChild(
					makeDrawerToggle(titleString, drawerTriggerHTMLElement)
				);
				return wrapperHTMLElement;
			}
			const fragments = idPrefix.split('.');
			const fragmentHTMLElements: HTMLElement[] = [];
			fragments.forEach((fragment, i) => {
				const linkHTMLElement = makeLinkElement(
					`#${fragments.slice(0, i + 1).join('.')}`,
					undefined,
					fragment
				);
				/*
				makeElement('a', undefined, fragment);
				linkHTMLElement.setAttribute(
					'href',
					`#${fragments.slice(0, i + 1).join('.')}`
				);
				*/
				fragmentHTMLElements.push(linkHTMLElement);
				if (i < fragments.length - 1)
					fragmentHTMLElements.push(makeSymbolSpan(' : '));
			});
			wrapperHTMLElement.appendChildren([
				...fragmentHTMLElements,
				makeDrawerToggle(titleString, drawerTriggerHTMLElement),
			]);

			return wrapperHTMLElement;
		},
		makeDrawerToggle: (
			title: string,
			drawerTriggerHTMLElement: HTMLElement & yafHTMLExtension
		) => {
			const handleIconHTMLElement = makeIconSpan('expand_less');
			const iconHTMLElement = makeElement('span', 'icon');
			iconHTMLElement.appendChild(handleIconHTMLElement);

			drawerTriggerHTMLElement.appendChildren([
				iconHTMLElement,
				makeTitleSpan(title),
			]);

			return drawerTriggerHTMLElement;
		},
	};

	/**
	 * Calls `renderDrawers()` from the root of the drawer tree only.
	 * @param parent
	 */
	static renderDrawersFromRoot = (parent: HTMLElement) => {
		const drawerHTMLElements = [...parent.children].filter(
			(child) => 'drawers' in child
		);
		drawerHTMLElements.forEach((drawer) =>
			(drawer as unknown as YafElementDrawers).drawers.renderDrawers()
		);
	};
}
const yafMemberGroupReflection: componentName = 'yaf-member-group-reflection';
customElements.define(yafMemberGroupReflection, YafMemberGroupReflection);
