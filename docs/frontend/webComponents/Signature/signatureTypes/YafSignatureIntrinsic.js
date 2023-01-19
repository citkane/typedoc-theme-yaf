import { needsParenthesis, makeTypeSpan, makeSymbolSpan, } from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';
export class YafContentSignatureIntrinsic extends YafHTMLElement {
    onConnect() {
        const { name } = this.props;
        const HTMLElements = [makeTypeSpan(name)];
        if (needsParenthesis(this)) {
            HTMLElements.unshift(makeSymbolSpan('('));
            HTMLElements.push(makeSymbolSpan(')'));
        }
        this.appendChildren(HTMLElements.flat());
    }
}
const componentName = 'yaf-signature-intrinsic';
customElements.define(componentName, YafContentSignatureIntrinsic);
//# sourceMappingURL=YafSignatureIntrinsic.js.map