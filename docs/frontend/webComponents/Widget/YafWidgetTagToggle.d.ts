import { displayStates, yafDisplayOptions } from '../../../types/frontendTypes.js';
import { YafHTMLElement } from '../../index.js';
import YafElementDrawers from '../../YafElementDrawers.js';
export declare class YafWidgetTagToggle extends YafHTMLElement<{
    drawers: YafElementDrawers;
}> {
    static get observedAttributes(): string[];
    attributeChangedCallback(name: yafDisplayOptions, oldValue: displayStates, newValue: displayStates): void;
    onConnect(): void;
    disconnectedCallback(): void;
    private eventList;
    private static factory;
}
