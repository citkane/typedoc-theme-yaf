import { YafHTMLElement } from '../../index.js';
import router from '../../handlers/Router.js';
import { makeElement } from '../../yafElement.js';
import appState from '../../handlers/AppState.js';
import { events } from '../../handlers/index.js';
export class YafNavigationLink extends YafHTMLElement {
    onConnect() {
        const { factory } = YafNavigationLink;
        this.aHTMLElement = makeElement('a', [...this.classList].join(' ').trim());
        if (this.getAttribute('href') === '/')
            this.setAttribute('href', router.baseUrl);
        let targetURL = router.getTargetURL(this);
        if (factory.isNumberPath(targetURL.pathname)) {
            const reflectionId = targetURL.pathname.replace(/^\//, '');
            const reflectionLink = appState.reflectionMap[reflectionId];
            if (!reflectionLink)
                return;
            const { query, hash } = reflectionLink;
            this.setAttribute('href', hash ? `?page=${query}#${hash}` : `?page=${query}`);
            targetURL = router.getTargetURL(this);
        }
        if (targetURL.origin !== window.location.origin)
            this.setAttribute('target', '_blank');
        this.setAttribute('href', encodeURI(targetURL.href));
        this.getAttributeNames().forEach((name) => {
            const value = this.getAttribute(name);
            if (value)
                this.aHTMLElement.setAttribute(name, value);
        });
        this.aHTMLElement.replaceChildren(...[...this.childNodes]);
        this.replaceChildren(this.aHTMLElement);
        events.on('click', (e) => router.route(this, e), this.aHTMLElement);
    }
    disconnectedCallback() {
        events.off('click', (e) => router.route(this, e), this.aHTMLElement);
    }
}
YafNavigationLink.factory = {
    isNumberPath: (path) => /^\/\d+$/.test(path),
};
const yafNavigationLink = 'yaf-navigation-link';
customElements.define(yafNavigationLink, YafNavigationLink);
//# sourceMappingURL=YafNavigationLink.js.map