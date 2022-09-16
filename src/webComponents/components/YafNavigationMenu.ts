import { componentName, htmlString, treeMenuRoot } from '../types.js';
import { YAFElement } from '../lib/YafElement.js';

const componentName: componentName = 'yaf-navigation-menu';

export class YafNavigationMenu extends YAFElement {
	shadow: ShadowRoot;
	constructor() {
		super(componentName);
		this.shadow = this.attachShadow({ mode: 'open' });
	}
	async connectedCallback() {
		const html = await this.fetchTemplate('html');
		const css = await this.fetchTemplate('css');
		const innerHtml = this.makeElement(html);
		const innerCss = this.makeElement(css);
		const homeLink = document.createElement('yaf-navigation-link');
		homeLink.innerHTML = 'HOME';
		homeLink.setAttribute('href', '/');
		const tree = innerHtml.querySelector(
			'yaf-navigation-menu-branch'
		) as Element & { props: treeMenuRoot };
		tree.props = (await this.fetchData(
			'yafNavigationMenu'
		)) as treeMenuRoot;

		this.shadow.appendChild(innerCss);
		this.shadow.appendChild(homeLink);
		this.shadow.appendChild(innerHtml);
	}
}
customElements.define(componentName, YafNavigationMenu);

const componentName2: componentName = 'yaf-navigation-menu-branch';

export class YafNavigationMenuBranch extends YAFElement {
	props!: treeMenuRoot;
	parentId: string;
	constructor() {
		super(componentName2);
		this.parentId = this.getAttribute('parentId') as string;
	}

	async connectedCallback() {
		const innerHtml: htmlString = `<ul id="${this.parentId}" ></ul>`;
		const menuNode = this.makeElement(innerHtml);
		for (const [id, branch] of Object.entries(this.props)) {
			const { query, hash } = branch;
			let href = `?page=${query}`;
			if (hash) href += `#${hash}`;
			const li = document.createElement('li');
			const link = document.createElement('yaf-navigation-link');
			link.innerHTML = branch.name;
			link.setAttribute('href', href);
			li.appendChild(link);
			if (branch.children && Object.keys(branch.children).length) {
				const newBranch = this.makeElement(
					`<${componentName2} parentId="${id}" />`
				) as Element & { props: treeMenuRoot };
				newBranch.props = branch.children;
				li.appendChild(newBranch);
			}
			menuNode.appendChild(li);
		}
		this.parentNode?.replaceChild(menuNode, this);
	}
}
customElements.define(componentName2, YafNavigationMenuBranch);
