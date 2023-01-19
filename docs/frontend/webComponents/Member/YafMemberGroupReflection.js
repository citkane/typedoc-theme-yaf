var _a;
import YafElementDrawers from '../../YafElementDrawers.js';
import { makeElement, makeTitleSpan, makeIconSpan, normaliseFlags, } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
/**
 *
 */
export class YafMemberGroupReflection extends YafHTMLElement {
    onConnect() {
        const { title, children, pageId, nested, idPrefix } = this.props;
        const { factory } = YafMemberGroupReflection;
        this.id = `member_${pageId}_${title}`;
        const drawerHTMLElement = makeElement(`ul`);
        const drawerTriggerHTMLElement = makeElement('span', 'trigger');
        const groupHeaderHTMLElement = makeElement(nested ? 'h3' : 'h2');
        const groupTitleHTMLElement = makeTitleSpan(`${title}`);
        const handleIconHTMLElement = makeIconSpan('expand_less');
        const iconHTMLElement = makeElement('span', 'icon');
        const groupCountHTMLElement = factory.counterWidget(children.length);
        const drawerLiHTMLElements = factory.drawerListChildren(children, idPrefix);
        iconHTMLElement.appendChild(handleIconHTMLElement);
        drawerTriggerHTMLElement.appendChildren([
            iconHTMLElement,
            groupTitleHTMLElement,
        ]);
        groupHeaderHTMLElement.appendChildren([
            drawerTriggerHTMLElement,
            groupCountHTMLElement,
        ]);
        drawerHTMLElement.appendChildren(drawerLiHTMLElements);
        this.appendChildren([groupHeaderHTMLElement, drawerHTMLElement]);
        this.drawers = new YafElementDrawers(this, drawerHTMLElement, drawerTriggerHTMLElement, this.id);
        drawerHTMLElement.prepend(factory.tagToggles(this.drawers));
        /**
         * NOTE: `drawers.renderDrawers()` is called from `YafMemberDeclaration` or `YafContentMembers`.
         * That is the root of the drawer tree and propogates downwards to branches
         * from within the `renderDrawers` method itself.
         */
    }
    disconnectedCallback() {
        this.drawers.drawerHasDisconnected();
    }
}
_a = YafMemberGroupReflection;
YafMemberGroupReflection.factory = {
    drawerListChildren: (children, idPrefix = '') => children.map((child) => {
        const liHTMLElement = _a.factory.listItem(child.flags);
        const id = `${idPrefix ? idPrefix + '.' : ''}${child.name}`;
        liHTMLElement.id = id;
        liHTMLElement.appendChild(_a.factory.member(child, id));
        return liHTMLElement;
    }),
    listItem: (flags) => makeElement('li', flags ? normaliseFlags(flags).join(' ') : ''),
    member: (data, idPrefix) => makeElement('yaf-member', null, null, { data, idPrefix }),
    tagToggles: (drawers) => {
        const toggleHTMLElement = makeElement('yaf-widget-tag-toggle', 'tagtoggles', null, { drawers });
        const liHTMLElement = makeElement('li');
        liHTMLElement.appendChild(toggleHTMLElement);
        return liHTMLElement;
    },
    counterWidget: (count) => makeElement('yaf-widget-counter', null, null, {
        count,
    }),
};
/**
 * Calls `renderDrawers()` from the root of the drawer tree only.
 * @param parent
 */
YafMemberGroupReflection.renderDrawersFromRoot = (parent) => {
    const drawerHTMLElements = [...parent.children].filter((child) => 'drawers' in child);
    drawerHTMLElements.forEach((drawer) => drawer.drawers.renderDrawers());
};
const yafMemberGroupReflection = 'yaf-member-group-reflection';
customElements.define(yafMemberGroupReflection, YafMemberGroupReflection);
//# sourceMappingURL=YafMemberGroupReflection.js.map