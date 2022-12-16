import { DrawerElement } from '../../../types/frontendTypes.js';
import { YafWidgetKind } from '../Widget/YafWidgets.js';

import appState from '../../lib/AppState.js';
import events from '../../lib/events/eventApi.js';
import yafElement from '../../yafElement.js';
import YafElementDrawers from '../../YafElementDrawers.js';

const { action } = events;

/**
 *
 */
export class YafNavigationHeader extends HTMLElement {
	drawers!: YafElementDrawers;
	drawer!: HTMLElement;
	drawerTrigger!: HTMLElement;
	connectedCallback() {
		if (yafElement.debounce(this as Record<string, unknown>)) return;

		this.drawerTrigger = yafElement.makeElement('span', 'info');
		this.drawerTrigger.appendChild(
			yafElement.makeIconSpan('question_mark', 18)
		);
		this.drawerTrigger.appendChild(
			yafElement.makeIconSpan('highlight_off')
		);

		this.id = 'yafNavigationHeader';
		this.drawer = this.makeInfoDrawer();

		this.drawers = new YafElementDrawers(
			this as unknown as DrawerElement,
			this.drawer,
			this.drawerTrigger,
			this.id
		);

		const navigationControls = yafElement.makeElement('div');
		const homeLink = yafElement.makeLinkElement('/', 'button');

		navigationControls.classList.add('controls-navigation');

		homeLink.appendChild(yafElement.makeIconSpan('home'));
		navigationControls.appendChild(homeLink);
		navigationControls.appendChild(this.makeMenuRollControls());
		this.appendChild(navigationControls);
		this.appendChild(this.drawer);

		this.drawers.renderDrawers(true);
	}
	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
	}
	makeMenuRollControls = () => {
		const openAll = yafElement.makeElement('span', 'open button');
		const closeAll = yafElement.makeElement('span', 'close button');
		const drawerControls = yafElement.makeElement(
			'span',
			'controls-drawers'
		);

		openAll.appendChild(yafElement.makeIconSpan('expand_more'));
		closeAll.appendChild(yafElement.makeIconSpan('expand_less'));
		drawerControls.appendChild(this.drawerTrigger);
		drawerControls.appendChild(openAll);
		drawerControls.appendChild(closeAll);

		openAll.onclick = () => events.dispatch(action.menu.rollMenuDown());
		closeAll.onclick = () => events.dispatch(action.menu.rollMenuUp());

		return drawerControls;
	};
	makeInfoDrawer = () => {
		const kinds = [
			262144, 128, 512, 8, 64, 256, 2048, 4, 1024, 8388608, 32, 4194304,
			2,
		].sort();

		const infoDrawer = yafElement.makeElement('div', 'drawers-info');
		const inner = yafElement.makeElement('span', 'inner');

		kinds.forEach((kind) => {
			let nameString = appState.kindSymbols[kind].className;
			nameString =
				nameString.charAt(0).toUpperCase() + nameString.slice(1);

			const widget = yafElement.makeElement('span', 'widget');
			const name = yafElement.makeNameSpan(nameString);
			const kindIcon = yafElement.makeElement<
				YafWidgetKind,
				YafWidgetKind['props']
			>('yaf-widget-kind', null, null, { kind: String(kind) });

			widget.appendChild(kindIcon);
			widget.appendChild(name);
			inner.appendChild(widget);
		});
		infoDrawer.appendChild(inner);

		return infoDrawer;
	};
}
const yafNavigationHeader = 'yaf-navigation-header';
customElements.define(yafNavigationHeader, YafNavigationHeader);
