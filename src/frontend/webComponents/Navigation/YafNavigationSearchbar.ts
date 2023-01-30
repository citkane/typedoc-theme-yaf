import { componentName, yafEventList } from '../../../types/frontendTypes.js';
import { action, events } from '../../handlers/index.js';
import { makeElement, makeIconSpan } from '../../yafElement.js';
import YafHTMLElement from '../../YafHTMLElement.js';

const { action, trigger } = events;

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
		searchHTMLInput.oninput = this.searchChanged;

		iconsHTMLElement.appendChildren([
			searchIcon(),
			clearIcon(searchHTMLInput),
		]);
		this.appendChildren([searchHTMLInput, iconsHTMLElement]);
		this.eventsList.forEach((event) => events.on(...event));
	}
	disconnectedCallback() {
		this.eventsList.forEach((event) => events.off(...event));
	}

	private focussed = () => {
		this.classList.add('focussed');
	};
	private blurred = () => {
		this.classList.remove('focussed');
	};
	private searchChanged = (e: Event) => {
		const searchString = (<HTMLInputElement>e.target).value;
		events.dispatch(action.menu.search(searchString));
	};
	private resetSearch = ({
		detail,
	}: CustomEvent<action['menu']['search']>) => {
		const { searchString } = detail;
		searchString.length > 0
			? this.classList.add('busy')
			: this.classList.remove('busy');
	};

	private eventsList: yafEventList = [
		[trigger.menu.search, this.resetSearch],
	];

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
