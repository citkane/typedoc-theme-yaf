import { YAFReflectionLink } from '../../../types/types';
import { appState, events } from '../../lib/index.js';
import yafElement from '../../yafElement.js';
import { YafWidgetCounter } from '../Widget/index.js';

const { action } = events;

export class YafMemberGroupLink extends HTMLElement {
	props!: {
		title: string;
		children: YAFReflectionLink[];
	};
	ul = yafElement.makeElement(`ul`);

	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;
		const { children, title } = this.props;

		const groupHeader = yafElement.makeElement('h2');
		const groupTitle = yafElement.makeTitleSpan(`${title}`);
		groupHeader.appendChild(groupTitle);

		const groupCount =
			yafElement.makeElement<YafWidgetCounter>('yaf-widget-counter');
		groupCount.props = {
			count: children.length,
		};
		groupHeader.appendChild(groupCount);

		this.appendChild(groupHeader);
		this.ul.classList.add('links');
		children.forEach((child) => {
			child = this.transformReferencedChild(child);

			const item = yafElement.makeElement(`li`);
			const link = yafElement.makeLinkElement(
				`?page=${child.fileName}`,
				undefined,
				child.name
			);

			item.appendChild(link);
			item.id = child.name;
			item.onclick = () =>
				events.dispatch(action.content.scrollTo(`menu_${child.id}`));
			this.ul.appendChild(item);
		});
		this.appendChild(this.ul);
	}
	private transformReferencedChild = (child: YAFReflectionLink) => {
		if (!child.kind || appState.reflectionKind[child.kind] !== 'Reference')
			return child;
		const target = appState.reflectionMap[child.target!];

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
				child.name = `Re-named/exported: "${target.name}" to "${child.name}"`;
		}
		return child;
	};
}
const yafMemberGroupLink = 'yaf-member-group-link';
customElements.define(yafMemberGroupLink, YafMemberGroupLink);
