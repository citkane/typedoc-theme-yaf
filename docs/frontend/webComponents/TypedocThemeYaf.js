import { getHtmlTemplate } from '../yafElement.js';
import appState from '../handlers/AppState.js';
import { YafHTMLElement } from '../index.js';
import { events } from '../handlers/index.js';
const { trigger } = events;
/**
 * This is the highest level component of the theme, parent container to all other custom theme elements
 */
export class TypedocThemeYaf extends YafHTMLElement {
    constructor() {
        super(...arguments);
        this.toggleMenu = ({ detail, }) => {
            const { state } = detail;
            if (state === 'close' || this.classList.contains('menuOpen')) {
                this.classList.remove('menuOpen');
            }
            else {
                this.classList.add('menuOpen');
            }
        };
        this.events = [[trigger.menu.toggle, this.toggleMenu]];
    }
    onConnect() {
        appState
            .initCache()
            .then(() => this.appendChild(getHtmlTemplate(typedocThemeYaf)));
        this.events.forEach((event) => events.on(...event));
    }
    disconnectedCallback() {
        this.events.forEach((event) => events.off(...event));
    }
}
const typedocThemeYaf = 'typedoc-theme-yaf';
customElements.define(typedocThemeYaf, TypedocThemeYaf);
//# sourceMappingURL=TypedocThemeYaf.js.map