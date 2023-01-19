import { getHtmlTemplate } from '../yafElement.js';
import appState from '../handlers/AppState.js';
import { YafHTMLElement } from '../index.js';
/**
 * This is the highest level component of the theme, parent container to all other custom theme elements
 */
export class TypedocThemeYaf extends YafHTMLElement {
    onConnect() {
        appState
            .initCache()
            .then(() => this.appendChild(getHtmlTemplate(typedocThemeYaf)));
    }
}
const typedocThemeYaf = 'typedoc-theme-yaf';
customElements.define(typedocThemeYaf, TypedocThemeYaf);
//# sourceMappingURL=TypedocThemeYaf.js.map