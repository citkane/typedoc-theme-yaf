import { YAFReflectionLink } from '../../../types/types';
import { appState, events } from '../../lib/index.js';
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
			child = this.serialiseReferencedChild(child);

			const liHTMLElement = makeElement(`li`);
			const linkHTMLElement = makeLinkElement(
				`?page=${child.fileName}`,
				undefined,
				child.name
			);

			liHTMLElement.appendChild(linkHTMLElement);
			liHTMLElement.id = child.name;
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
				child.fileName = appState.reflectionMap[child.id!].fileName;
				child.name = `Re-exported: "${child.name}"`;
				break;
			case 'ReExportsLink':
				child.fileName = appState.reflectionMap[child.target!].fileName;
				child.name = `Re-exported: "${child.name}"`;
				break;
			case 'ReExportsRenameLink':
				child.fileName = appState.reflectionMap[child.target!].fileName;
				child.name = `Re-named/exported: "${target!.name}" to "${
					child.name
				}"`;
		}
		return child;
	};
}
const yafMemberGroupLink = 'yaf-member-group-link';
customElements.define(yafMemberGroupLink, YafMemberGroupLink);
