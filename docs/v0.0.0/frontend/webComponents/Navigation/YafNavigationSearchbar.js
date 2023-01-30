import { events } from '../../handlers/index.js';
import { makeElement, makeIconSpan } from '../../yafElement.js';
import YafHTMLElement from '../../YafHTMLElement.js';
const { action, trigger } = events;
/**
 *
 */
export class YafNavigationSearchbar extends YafHTMLElement {
    constructor() {
        super(...arguments);
        this.focussed = () => {
            this.classList.add('focussed');
        };
        this.blurred = () => {
            this.classList.remove('focussed');
        };
        this.searchChanged = (e) => {
            const searchString = e.target.value;
            events.dispatch(action.menu.search(searchString));
        };
        this.resetSearch = ({ detail, }) => {
            const { searchString } = detail;
            searchString.length > 0
                ? this.classList.add('busy')
                : this.classList.remove('busy');
        };
        this.eventsList = [
            [trigger.menu.search, this.resetSearch],
        ];
    }
    onConnect() {
        const { searchInput, searchIcon, clearIcon } = YafNavigationSearchbar.factory;
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
}
YafNavigationSearchbar.factory = {
    searchInput: () => {
        const searchHTMLInput = makeElement('input');
        searchHTMLInput.setAttribute('type', 'search');
        searchHTMLInput.setAttribute('placeholder', 'Search the documents...');
        searchHTMLInput.setAttribute('aria-label', 'Search the documents');
        searchHTMLInput.setAttribute('minlength', '3');
        return searchHTMLInput;
    },
    searchIcon: () => {
        const searchIconHTMLElement = makeIconSpan('search', 18);
        searchIconHTMLElement.classList.add('searchIcon');
        return searchIconHTMLElement;
    },
    clearIcon: (searchHTMLInput) => {
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
const yafNavigationSearchbar = 'yaf-navigation-searchbar';
customElements.define(yafNavigationSearchbar, YafNavigationSearchbar);
//# sourceMappingURL=YafNavigationSearchbar.js.map