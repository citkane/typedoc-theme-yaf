import { YafHTMLElement } from '../../index.js';
import { makeElement, makeFlags } from '../../yafElement.js';
export class YafSignatureParameters extends YafHTMLElement {
    constructor() {
        super(...arguments);
        this.makeFlags = (parameter) => {
            const { flags, comment } = parameter;
            const td = makeElement('td');
            const flagsElement = makeFlags(flags, comment);
            td.appendChild(flagsElement);
            return td;
        };
        this.makeName = (parameter) => {
            const { flags, name } = parameter;
            const td = makeElement('td', null, flags.isRest ? `...${name}` : name);
            return td;
        };
        this.makeType = (parameter) => {
            const { type } = parameter;
            const td = makeElement('td', 'type');
            const pre = makeElement('pre', 'highlight');
            const typeSignature = makeElement('yaf-signature');
            typeSignature.props = { type, context: 'none' };
            pre.appendChild(typeSignature);
            td.appendChild(pre);
            return td;
        };
        this.makeDefault = (parameter) => {
            const { defaultValue } = parameter;
            const td = makeElement('td', null, defaultValue);
            return td;
        };
        this.makeComment = (parameter) => {
            const { text } = parameter;
            const td = makeElement('td');
            if (text === null || text === void 0 ? void 0 : text.comment)
                td.innerHTML = text.comment;
            return td;
        };
    }
    onConnect() {
        if (!this.props)
            return;
        this.classList.add('scroller');
        this.classList.add('horizontal');
        this.appendChild(makeElement('h5', null, 'Parameters:'));
        const table = makeElement('table');
        const thead = makeElement('thead');
        const headers = makeElement('tr');
        ['flags', 'name', 'type', 'default', 'comment'].forEach((heading) => headers.appendChild(makeElement('th', null, heading)));
        thead.appendChild(headers);
        table.appendChild(thead);
        const tbody = makeElement('tbody');
        this.props.forEach((parameter) => {
            const row = makeElement('tr');
            row.appendChildren([
                this.makeFlags(parameter),
                this.makeName(parameter),
                this.makeType(parameter),
                this.makeDefault(parameter),
                this.makeComment(parameter),
            ]);
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        this.appendChild(table);
        this.appendChild(table);
    }
}
const yafSignatureParameters = 'yaf-signature-parameters';
customElements.define(yafSignatureParameters, YafSignatureParameters);
//# sourceMappingURL=YafSignatureParameters.js.map