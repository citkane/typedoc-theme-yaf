import appState from '../../handlers/AppState.js';
import events from '../../handlers/events/eventApi.js';
import YafElementDrawers, { DrawerElement } from '../../YafElementDrawers.js';
import {
	makeIconSpan,
	makeElement,
	makeLinkElement,
	makeNameSpan,
} from '../../yafElement.js';
import { kindSymbols } from '../../../types/types.js';
import { YafHTMLElement } from '../../index.js';
import { YafWidgetKind } from '../Widget/index.js';
const { action } = events;

/**
 *
 */
export class YafNavigationHeader extends YafHTMLElement {
	drawers!: YafElementDrawers;
	id = 'yafNavigationHeader';

	onConnect() {
		const { factory } = YafNavigationHeader;
		const drawerTriggerHTMLElement = makeElement('span', 'info');
		const navigationControlsHTMLElement = makeElement(
			'div',
			'controls-navigation'
		);
		const homeLinkHTMLElement = makeLinkElement('/', 'button');
		const drawerHTMLElement = factory.infoDrawer(
			this.keyKinds,
			appState.kindSymbols
		);

		homeLinkHTMLElement.appendChild(makeIconSpan('home'));
		drawerTriggerHTMLElement.appendChildren([
			makeIconSpan('question_mark', 18),
			makeIconSpan('highlight_off'),
		]);
		navigationControlsHTMLElement.appendChildren([
			homeLinkHTMLElement,
			factory.menuRollControls(drawerTriggerHTMLElement),
		]);

		this.appendChildren([navigationControlsHTMLElement, drawerHTMLElement]);

		this.drawers = new YafElementDrawers(
			this as unknown as DrawerElement,
			drawerHTMLElement,
			drawerTriggerHTMLElement,
			this.id
		);
		this.drawers.renderDrawers(true);
	}
	disconnectedCallback() {
		this.drawers.drawerHasDisconnected();
	}

	private static factory = {
		menuRollControls: (drawerTriggerHTMLElement: HTMLElement) => {
			const openAllHTMLElement = makeElement('span', 'open button');
			const closeAllHTMLElement = makeElement('span', 'close button');
			const drawerControlsHTMLElement = makeElement(
				'span',
				'controls-drawers'
			);

			openAllHTMLElement.appendChild(makeIconSpan('expand_more'));
			closeAllHTMLElement.appendChild(makeIconSpan('expand_less'));
			drawerControlsHTMLElement.appendChildren([
				drawerTriggerHTMLElement,
				openAllHTMLElement,
				closeAllHTMLElement,
			]);

			openAllHTMLElement.onclick = () =>
				events.dispatch(action.menu.rollMenuDown());
			closeAllHTMLElement.onclick = () =>
				events.dispatch(action.menu.rollMenuUp());

			return drawerControlsHTMLElement;
		},
		infoDrawer: (keyKinds: number[], kindSymbols: kindSymbols) => {
			const infoDrawerHTMLElement = makeElement('div', 'drawers-info');
			const innerHTMLElement = makeElement('span', 'inner');

			const keySymbolHTMLElements = keyKinds.map((keyKind) => {
				let nameString = kindSymbols[keyKind].className;
				nameString =
					nameString.charAt(0).toUpperCase() + nameString.slice(1);

				const widgetHTMLElement = makeElement('span', 'widget');
				const nameHTMLElement = makeNameSpan(nameString);
				const kindIconHTMLElement = this.factory.kindIcon(
					String(keyKind)
				);

				widgetHTMLElement.appendChildren([
					kindIconHTMLElement,
					nameHTMLElement,
				]);

				return widgetHTMLElement;
			});

			innerHTMLElement.appendChildren(keySymbolHTMLElements);
			infoDrawerHTMLElement.appendChild(innerHTMLElement);
			return infoDrawerHTMLElement;
		},
		kindIcon: (kind: string) =>
			makeElement<YafWidgetKind, YafWidgetKind['props']>(
				'yaf-widget-kind',
				null,
				null,
				{ kind }
			),
	};

	private keyKinds = [
		appState.reflectionKind.Property,
		appState.reflectionKind.Method,
		appState.reflectionKind.Accessor,
		appState.reflectionKind.Variable,
		appState.reflectionKind.TypeAlias,
		appState.reflectionKind.Constructor,
		appState.reflectionKind.Function,
		appState.reflectionKind.Class,
		appState.reflectionKind.Namespace,
		appState.reflectionKind.Interface,
		appState.reflectionKind.Namespace,
		appState.reflectionKind.Enum,
		appState.reflectionKind.Reference,
	];
}
const yafNavigationHeader = 'yaf-navigation-header';
customElements.define(yafNavigationHeader, YafNavigationHeader);
