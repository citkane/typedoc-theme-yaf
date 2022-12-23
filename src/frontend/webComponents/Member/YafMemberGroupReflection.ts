import {
	componentName,
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
} from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
import { YafWidgetCounter, YafWidgetTagToggle } from '../Widget/index.js';

/**
 *
 */
export class YafMemberGroupReflection extends YafHTMLElement<yafMemberGroupReflectionProps> {
	drawers!: YafElementDrawers;

	onConnect() {
		const { title, children, pageId, nested } = this.props;
		const { factory } = YafMemberGroupReflection;
		this.id = `member_${pageId}_${title}`;

		const drawerHTMLElement = makeElement(`ul`);
		const drawerTriggerHTMLElement = makeElement('span', 'trigger');
		const groupHeaderHTMLElement = makeElement(nested ? 'h3' : 'h2');
		const groupTitleHTMLElement = makeTitleSpan(`${title}`);
		const handleIconHTMLElement = makeIconSpan('expand_less');
		const iconHTMLElement = makeElement('span', 'icon');
		const groupCountHTMLElement = factory.counterWidget(children.length);
		const drawerLiHTMLElements = factory.drawerListChildren(children);

		iconHTMLElement.appendChild(handleIconHTMLElement);
		drawerTriggerHTMLElement.appendChildren([
			iconHTMLElement,
			groupTitleHTMLElement,
		]);
		groupHeaderHTMLElement.appendChildren([
			drawerTriggerHTMLElement,
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
		/**
		 * NOTE: `drawers.renderDrawers()` is called from `YafMemberDeclaration`.
		 * That is the root of the drawer tree and propogates downwards to branches
		 * from within the `renderDrawers` method itself.
		 */

		drawerHTMLElement.prepend(factory.tagToggles(this.drawers));
	}
	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
	}

	private static factory = {
		drawerListChildren: (children: (YAFDataObject | YAFReflectionLink)[]) =>
			children.map((child) => {
				const liHTMLElement = this.factory.listItem(child.flags);
				liHTMLElement.id = child.name;
				liHTMLElement.appendChild(this.factory.member(child));

				return liHTMLElement;
			}),
		listItem: (flags: JSONOutput.ReflectionFlags | undefined) =>
			makeElement('li', flags ? normaliseFlags(flags).join(' ') : ''),
		member: (child: YAFDataObject | YAFReflectionLink) =>
			makeElement<YafMember, YafMember['props']>(
				'yaf-member',
				null,
				null,
				child
			),
		tagToggles: (drawers: YafElementDrawers) => {
			const toggleHTMLElement = makeElement<
				YafWidgetTagToggle,
				YafWidgetTagToggle['props']
			>('yaf-widget-tag-toggle', 'tagtoggles', null, { drawers });
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
	};
}
const yafMemberGroupReflection: componentName = 'yaf-member-group-reflection';
customElements.define(yafMemberGroupReflection, YafMemberGroupReflection);
