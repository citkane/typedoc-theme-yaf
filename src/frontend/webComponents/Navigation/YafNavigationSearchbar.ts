import { componentName } from '../../../types/frontendTypes.js';
import { events } from '../../handlers/index.js';
import { makeElement, makeIconSpan } from '../../yafElement.js';
import YafHTMLElement from '../../YafHTMLElement.js';

const { action } = events;

/**
 *
 */
export class YafNavigationSearchbar extends YafHTMLElement {
	onConnect() {
		const { searchInput, searchIcon, clearIcon } =
			YafNavigationSearchbar.factory;

		const searchHTMLInput = searchInput();
		const iconsHTMLElement = makeElement('span', 'wrapper');

		searchHTMLInput.onfocus = this.focussed;
		searchHTMLInput.onblur = this.blurred;
		searchHTMLInput.oninput = this.changed;

		iconsHTMLElement.appendChildren([
			searchIcon(),
			clearIcon(searchHTMLInput),
		]);
		this.appendChildren([searchHTMLInput, iconsHTMLElement]);
		//this.eventsList.forEach((event) => events.on(...event));
	}
	disconnectedCallback() {
		//this.eventsList.forEach((event) => events.off(...event));
	}
	private focussed = () => {
		this.classList.add('focussed');
	};
	private blurred = () => {
		this.classList.remove('focussed');
	};
	private changed = (e: Event) => {
		const searchstring = (<HTMLInputElement>e.target).value;
		events.dispatch(action.menu.search(searchstring));
	};

	private static factory = {
		searchInput: () => {
			const searchHTMLInput = makeElement<HTMLInputElement>('input');

			searchHTMLInput.setAttribute('type', 'search');
			searchHTMLInput.setAttribute(
				'placeholder',
				'Search the documents...'
			);
			searchHTMLInput.setAttribute('aria-label', 'Search the documents');

			searchHTMLInput.setAttribute('minlength', '3');
			return searchHTMLInput;
		},
		searchIcon: () => {
			const searchIconHTMLElement = makeIconSpan('search', 18);
			searchIconHTMLElement.classList.add('searchIcon');

			return searchIconHTMLElement;
		},
		clearIcon: (searchHTMLInput: HTMLInputElement) => {
			const clearIconHTMLElement = makeIconSpan('clear', 18);
			clearIconHTMLElement.classList.add('clearIcon');

			clearIconHTMLElement.onmousedown = () => {
				searchHTMLInput.value = '';
				searchHTMLInput.blur();
				events.dispatch(action.menu.search(''));
			};
			return clearIconHTMLElement;
		},
	};
}
const yafNavigationSearchbar: componentName = 'yaf-navigation-searchbar';
customElements.define(yafNavigationSearchbar, YafNavigationSearchbar);
