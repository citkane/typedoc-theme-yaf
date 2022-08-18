import { yafEvents } from "../events.js";
import { componentName, contentLocation } from "../types";
import { YAFElement } from "../YAFElement.js";

const componentName: componentName = 'yaf-content';
const body = document.querySelector('body') as HTMLBodyElement;

export class yafContent extends YAFElement {
	constructor(){
		super(componentName);
	}
	connectedCallback(){
		body.addEventListener(yafEvents.content.setLocation, this.setContentLocation as EventListener);
		this.innerHTML='Hello Content';
	}
	setContentLocation(e:CustomEvent){
		const location: contentLocation = e.detail;
		console.log(location);
		console.log(location.fragment, location.hash);
	}
}
customElements.define(componentName, yafContent);