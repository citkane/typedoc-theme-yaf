import { event } from '../lib/eventApi.js';
import { YafElementDrawers } from '../YafElementDrawers.js';
import { YafWidgetKind } from './YafWidgets.js';

/**
 *
 */
export class YafNavigationHeader extends YafElementDrawers {
	constructor() {
		super(yafNavigationHeader);

		const infoLink = this.makeSpan('', 'info');
		infoLink.appendChild(this.makeIcon('question_mark', 18));
		infoLink.appendChild(this.makeIcon('highlight_off'));

		this.drawerInit(this, this.makeInfoDrawer(), infoLink);
	}
	connectedCallback() {
		if (this.debounce()) return;

		const navigationControls = this.makeElement('<div />');
		navigationControls.classList.add('controls-navigation');

		const homeLink = this.makeElement('<yaf-navigation-link href="/" />');
		homeLink.classList.add('button');
		homeLink.appendChild(this.makeIcon('home'));

		navigationControls.appendChild(homeLink);
		//navigationControls.appendChild(this.drawerTrigger);
		navigationControls.appendChild(this.makeMenuRollControls());

		this.appendChild(navigationControls);
		this.appendChild(this.drawer);

		this.drawerHasConnected();
	}
	disconnectedCallback() {
		this.drawerHasDisconnected();
	}
	makeMenuRollControls = () => {
		const openAll = this.makeSpan('', 'open button');
		openAll.appendChild(this.makeIcon('expand_more'));
		openAll.onclick = this.openAll;

		const closeAll = this.makeSpan('', 'close button');
		closeAll.appendChild(this.makeIcon('expand_less'));
		closeAll.onclick = this.closeAll;

		const drawerControls = this.makeSpan('', 'controls-drawers');
		drawerControls.appendChild(this.drawerTrigger);
		drawerControls.appendChild(openAll);
		drawerControls.appendChild(closeAll);

		return drawerControls;
	};
	makeInfoDrawer = () => {
		const kinds = [
			262144, 128, 512, 8, 64, 256, 2048, 4, 1024, 8388608, 32, 4194304,
			2,
		].sort();

		const infoDrawer = this.makeElement('<div />');
		infoDrawer.classList.add('drawers-info');

		const inner = this.makeSpan('', 'inner');
		infoDrawer.appendChild(inner);

		kinds.forEach((kind) => {
			const widget = this.makeSpan('', 'widget');
			let nameString = window.yaf.kindSymbols[kind].className;
			nameString =
				nameString.charAt(0).toUpperCase() + nameString.slice(1);
			const name = this.makeSpan(nameString, 'name');
			const kindIcon = this.makeElement<YafWidgetKind>(
				`<yaf-widget-kind kind="${kind}" />`
			);

			widget.appendChild(kindIcon);
			widget.appendChild(name);

			inner.appendChild(widget);
		});

		return infoDrawer;
	};
	openAll = () => {
		this.body.dispatchEvent(event.content.rollMenuDown());
	};
	closeAll = () => {
		this.body.dispatchEvent(event.content.rollMenuUp());
	};
}
const yafNavigationHeader = 'yaf-navigation-header';
customElements.define(yafNavigationHeader, YafNavigationHeader);
