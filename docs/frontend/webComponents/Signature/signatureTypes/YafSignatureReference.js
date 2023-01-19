var _a;
import appState from '../../../handlers/AppState.js';
import { makeNameSpan, makeLinkElement, makeElement, } from '../../../yafElement.js';
import { YafHTMLElement } from '../../../index.js';
/**
 *
 */
export class YafSignatureReference extends YafHTMLElement {
    onConnect() {
        const { externalUrl, id, name, typeArguments } = this.props;
        const { factory } = YafSignatureReference;
        const fileLink = id ? appState.reflectionMap[id] : undefined;
        const fileLinkName = fileLink ? fileLink.query : undefined;
        const nameHTMLElement = externalUrl
            ? factory.externalUrl(externalUrl, name)
            : fileLinkName
                ? factory.fileLinkName(fileLinkName, name)
                : makeNameSpan(name);
        const HTMLElements = [
            nameHTMLElement,
            factory.typeArguments(typeArguments),
        ];
        this.appendChildren(HTMLElements.flat());
    }
}
_a = YafSignatureReference;
YafSignatureReference.factory = {
    renderTypeArguments: (args) => makeElement('yaf-type-arguments', null, null, {
        args,
        context: 'referenceTypeArgument',
    }),
    externalUrl: (externalUrl, name) => {
        const linkHTMLElement = makeLinkElement(externalUrl);
        linkHTMLElement.setAttribute('target', '_blank');
        linkHTMLElement.appendChild(makeNameSpan(name));
        return linkHTMLElement;
    },
    fileLinkName: (fileLinkName, name) => {
        const linkHTMLElement = makeLinkElement(`?page=${fileLinkName}`);
        linkHTMLElement.appendChild(makeNameSpan(name));
        return linkHTMLElement;
    },
    typeArguments: (typeArguments) => typeArguments && typeArguments.length
        ? _a.factory.renderTypeArguments(typeArguments)
        : undefined,
};
const componentName = 'yaf-signature-reference';
customElements.define(componentName, YafSignatureReference);
//# sourceMappingURL=YafSignatureReference.js.map