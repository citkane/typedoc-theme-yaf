import { YAFReflectionLink } from '../../../types/types';
import { appState, events } from '../../handlers/index.js';
import { YafWidgetCounter } from '../Widget/index.js';
import {
	makeElement,
	makeTitleSpan,
	makeLinkElement,
} from '../../yafElement.js';
import { yafMemberGroupLinkProps } from '../../../types/frontendTypes';
import { YafHTMLElement } from '../../index.js';

const { action } = events;

export class YafMemberGroupLink extends YafHTMLElement<yafMemberGroupLinkProps> {
	onConnect() {
		const { children, title } = this.props;

		const ulHTMLElement = makeElement(`ul`, 'links');
		const groupHeaderHTMLElement = makeElement('h2');
		const groupTitleHTMLElement = makeTitleSpan(`${title}`);
		const groupCountHTMLElement = makeElement<
			YafWidgetCounter,
			YafWidgetCounter['props']
		>('yaf-widget-counter', null, null, {
			count: children.length,
		});

		groupHeaderHTMLElement.appendChildren([
			groupTitleHTMLElement,
			groupCountHTMLElement,
		]);

		children.forEach((child) => {
			const liHTMLElement = makeElement(`li`);
			liHTMLElement.id = child.name;

			child = this.serialiseReferencedChild(child);
			const linkHTMLElement = makeLinkElement(
				child.hash
					? `?page=${child.query}#${child.hash}`
					: `?page=${child.query}`,
				undefined,
				child.name
			);

			liHTMLElement.appendChild(linkHTMLElement);

			liHTMLElement.onclick = () =>
				events.dispatch(action.content.scrollTo(`menu_${child.id}`));

			ulHTMLElement.appendChild(liHTMLElement);
		});

		this.appendChildren([groupHeaderHTMLElement, ulHTMLElement]);
	}

	/**
	 * If the link is to a `Reference` kind, this modifies the name
	 * to indicate how the original target has been modified.
	 * @param child
	 * @returns
	 */
	private serialiseReferencedChild = (child: YAFReflectionLink) => {
		if (!child.kind || child.kind !== appState.reflectionKind.Reference)
			return child;

		const target = child.target
			? appState.reflectionMap[child.target]
			: undefined;

		const referenceType = !target
			? 'ReExports'
			: child.name === target.name
			? 'ReExportsLink'
			: 'ReExportsRenameLink';

		switch (referenceType) {
			case 'ReExports':
				child.query = appState.reflectionMap[child.id!].query;
				child.name = `Re-exported: "${child.name}"`;
				break;
			case 'ReExportsLink':
				child.query = appState.reflectionMap[child.target!].query;
				child.name = `Re-exported: "${child.name}"`;
				break;
			case 'ReExportsRenameLink':
				child.query = appState.reflectionMap[child.target!].query;
				child.name = `Re-named/exported: "${target!.name}" to "${
					child.name
				}"`;
		}
		return child;
	};
}
const yafMemberGroupLink = 'yaf-member-group-link';
customElements.define(yafMemberGroupLink, YafMemberGroupLink);
