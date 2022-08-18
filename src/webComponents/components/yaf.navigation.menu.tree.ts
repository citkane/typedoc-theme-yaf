import { componentName, html, treeMenuRoot } from '../types.js';
import { YAFElement } from '../YAFElement.js';

const componentName: componentName = 'yaf-navigation-menu-tree';

export class NavigationMenuTree extends YAFElement {
	shadow: ShadowRoot;
	constructor() {
		super(componentName);
		this.shadow = this.attachShadow({ mode: 'closed' });
	}
	async connectedCallback() {
		const html = await this.getHtml(componentName);
		const css = await this.getCss(componentName);

		const innerHtml = this.makeElement(html);
		const innerCss = this.makeElement(css);
		const homeLink = document.createElement('yaf-navigation-link');
		homeLink.innerHTML = 'HOME';
		homeLink.setAttribute('href', '/');
		const tree = innerHtml.querySelector(
			'yaf-navigation-menu-tree-branch'
		) as Element & { props: treeMenuRoot };
		tree.props = window.yaf.navigation.menu.tree;

		this.shadow.appendChild(innerCss);
		this.shadow.appendChild(homeLink);
		this.shadow.appendChild(innerHtml);
	}
}
customElements.define(componentName, NavigationMenuTree);

const componentName2: componentName = 'yaf-navigation-menu-tree-branch';

export class NavigationMenuTreeBranch extends YAFElement {
	props!: treeMenuRoot;
	parentId: string;
	constructor() {
		super(componentName2);
		this.parentId = this.getAttribute('parentId') as string;
	}
	async connectedCallback() {
		const innerHtml = `<ul id="${this.parentId}" ></ul>` as html;
		const menuNode = this.makeElement(innerHtml);
		for (const [id, branch] of Object.entries(this.props)) {
			const li = document.createElement('li');
			const link = document.createElement('yaf-navigation-link');
			link.innerHTML = branch.name;
			link.setAttribute('href', `?partial=${branch.url}`);
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
customElements.define(componentName2, NavigationMenuTreeBranch);
