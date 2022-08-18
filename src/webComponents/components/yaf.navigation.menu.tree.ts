import { componentName, contentLocation, contentFragment, contentHash, html, treeMenuRoot } from "../types.js";
import { YAFElement } from "../YAFElement.js";
import { yafEvents } from "../events.js";
import { timeStamp } from "console";

const componentName: componentName = 'yaf-navigation-menu-tree';
const body = document.querySelector('body') as HTMLBodyElement;

export class NavigationMenuTree extends YAFElement {
	constructor() {
		super(componentName);
	}
	async connectedCallback() {
		const html = await this.getHtml(componentName);
		const css = await this.getCss(componentName);
		const innerHtml = this.makeElement(html);
		const innerCss = this.makeElement(css);

		const tree = innerHtml.querySelector('yaf-navigation-menu-tree-branch');
		(<any>tree).props = window.yaf.navigation.menu.tree;

		const shadow = this.attachShadow({mode: 'closed'});
		shadow.appendChild(innerCss);
		shadow.appendChild(innerHtml);
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
		
		for(const [id, branch] of Object.entries(this.props)) {
			const li = document.createElement('li');
			const a = document.createElement('a');
			a.innerHTML = branch.name;
			a.href = this.getUrl(branch.url);
			a.addEventListener('click', e => {
				e.preventDefault();
				const url = new URL(a.href);
				console.log(url);
				const fragment = url.searchParams.get('fragment') as contentFragment;
				const detail: contentLocation = {
					fragment,
					hash: url.hash as contentHash
				}
				const changeLocationEvent = new CustomEvent(yafEvents.content.setLocation, { detail })
				body.dispatchEvent(changeLocationEvent);
			})
			li.appendChild(a);
			if(branch.children && Object.keys(branch.children).length) {
				const newBranch = this.makeElement(`<${componentName2} parentId="${id}" />`);
				(<any>newBranch).props = branch.children;
				li.appendChild(newBranch);
			}
			menuNode.appendChild(li);
		}
		this.parentNode?.replaceChild(menuNode, this);
	}
}
customElements.define(componentName2, NavigationMenuTreeBranch);

