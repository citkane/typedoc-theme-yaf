import { YafHTMLElement } from '../../index.js';
import { getHtmlTemplate } from '../../yafElement.js';
/**
 *
 */
export class YafChromeLeft extends YafHTMLElement {
    onConnect() {
        this.appendChild(getHtmlTemplate(yafChromeLeft));
    }
}
const yafChromeLeft = 'yaf-chrome-left';
customElements.define(yafChromeLeft, YafChromeLeft);
//# sourceMappingURL=YafChromeLeft.js.map