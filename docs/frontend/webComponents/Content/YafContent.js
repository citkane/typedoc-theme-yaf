import appState from '../../handlers/AppState.js';
import { makeElement } from '../../yafElement.js';
import { YafHTMLElement } from '../../index.js';
import { events } from '../../handlers/index.js';
const { trigger, action } = events;
export class YafContent extends YafHTMLElement {
    constructor() {
        super(...arguments);
        this.initPageData = () => {
            const url = new URL(window.location.href);
            let page = url.searchParams.get('page');
            page = decodeURIComponent(page || '');
            appState.getPageData(page || 'index').then((data) => {
                this.id = String(data.id);
                this.renderPageContent(data);
                events.dispatch(action.content.scrollTo(url.hash ? url.hash.replace('#', '') : 0));
                events.dispatch(action.content.breadcrumb(data.id));
            });
        };
        this.returnPageId = (e) => e.detail.callBack(Number(this.id));
        /**
         * @event
         */
        this.events = [
            [trigger.content.setLocation, this.initPageData],
            [trigger.get.pageContentId, this.returnPageId],
            ['popstate', this.initPageData, window],
        ];
    }
    onConnect() {
        this.events.forEach((event) => events.on(...event));
        this.initPageData();
    }
    disconnectedCallback() {
        this.events.forEach((event) => events.off(...event));
    }
    renderPageContent(data) {
        const { kind, typeParameter, signatures, text, hierarchy, id, is } = data;
        const { factory } = YafContent;
        const { Variable, TypeAlias } = appState.reflectionKind;
        const isVarOrTypeDeclaration = [Variable, TypeAlias].includes(kind) && data.is.declaration;
        const hasReadme = !!(text === null || text === void 0 ? void 0 : text.readme);
        const hasComment = !!(text === null || text === void 0 ? void 0 : text.comment);
        const hasHierchy = is.declaration && hierarchy;
        const HTMLElements = isVarOrTypeDeclaration
            ? [
                factory.contentHeader(data),
                factory.memberDeclaration(data),
            ]
            : [
                hasReadme
                    ? factory.contentMarked(text.readme)
                    : factory.contentHeader(data),
                hasComment
                    ? factory.contentMarked(text.comment)
                    : undefined,
                typeParameter
                    ? factory.typeParameters(typeParameter)
                    : undefined,
                hasHierchy
                    ? factory.contentHierarchy(hierarchy, id)
                    : undefined,
                signatures
                    ? factory.memberSignatures(signatures)
                    : factory.memberSources(data),
                factory.memberGroups(data),
            ];
        this.replaceChildren();
        HTMLElements.forEach((element) => {
            if (!element)
                return;
            this.appendChild(element);
            if ('drawers' in element)
                element.drawers.renderDrawers();
        });
    }
}
YafContent.factory = {
    contentHeader: (data) => makeElement('yaf-content-header', null, null, data),
    contentMarked: (html) => makeElement('yaf-content-marked', null, null, html),
    memberDeclaration: (data) => makeElement('yaf-member-declaration', null, null, { data, idPrefix: '' }),
    memberGroups: (data) => makeElement('yaf-content-members', null, null, data),
    typeParameters: (typeParameter) => makeElement('yaf-type-parameters', null, null, typeParameter),
    memberSignatures: (signatures) => makeElement('yaf-member-signatures', null, null, signatures),
    memberSources: (data) => {
        return data
            ? makeElement('yaf-member-sources', null, null, data)
            : undefined;
    },
    contentHierarchy: (hierarchy, id) => makeElement('yaf-content-hierarchy', null, null, {
        hierarchy,
        pageId: String(id),
        init: true,
    }),
};
const yafContent = 'yaf-content';
customElements.define(yafContent, YafContent);
//# sourceMappingURL=YafContent.js.map