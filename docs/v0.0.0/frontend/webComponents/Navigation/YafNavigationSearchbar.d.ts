import YafHTMLElement from '../../YafHTMLElement.js';
/**
 *
 */
export declare class YafNavigationSearchbar extends YafHTMLElement {
    onConnect(): void;
    disconnectedCallback(): void;
    private focussed;
    private blurred;
    private searchChanged;
    private resetSearch;
    private eventsList;
    private static factory;
}
